const fs = require('fs');
const path = require('path');

const { message } = require('./utils.js');

const AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-2'});

const s3 = new AWS.S3({apiVersion: '2006-03-01'});

const listBuckets = () => {
  s3.listBuckets((err, data) => { 
    if (err) { console.log("Error", err); }
    else { console.log("Success", data.Buckets); }
  });
};

const createBucket = (name) => {
  const params = { "Bucket": name, "ACL": "public-read" };
  s3.createBucket(params, message);
};

const upload = (name) => {
  const uploadParams = { "Bucket": process.argv[2], "Key": "", "Body": "" };
  const fileStream = fs.createReadStream(name);
  fileStream.on("error", err => console.log("File Error", err));
  
  uploadParams.Body = fileStream;
  uploadParams.Key = path.basename(name);

  s3.upload(uploadParams,  (err, data) => {
    if (err) { console.log("Error", err); } 
    else if (data) { console.log("Upload Success", data.Location); }
  });
};

const listObjects = (name) => {
  const params = { "Bucket": name };
  s3.listObjects(params, message);
};

const setBucketPermissions = (name) => {
  const params = { "Bucket": name };

  s3.getBucketAcl(params, (err, data) => {
    if (err) { console.log("Error", err); } 
    else if (data) { console.log("Success", data.Grants); }
  });

  const aclParams = {
    Bucket: 'STRING_VALUE', // required
    ACL: private | public-read | public-read-write | authenticated-read,
    AccessControlPolicy: {
      Grants: [
        {
          Grantee: {
            Type: CanonicalUser | AmazonCustomerByEmail | Group, // required
            DisplayName: 'STRING_VALUE',
            EmailAddress: 'STRING_VALUE',
            ID: 'STRING_VALUE',
            URI: 'STRING_VALUE'
          },
          Permission: FULL_CONTROL | WRITE | WRITE_ACP | READ | READ_ACP
        },
        // more items
      ],
      Owner: {
        DisplayName: 'STRING_VALUE',
        ID: 'STRING_VALUE'
      }
    },
    ContentMD5: 'STRING_VALUE',
    GrantFullControl: 'STRING_VALUE',
    GrantRead: 'STRING_VALUE',
    GrantReadACP: 'STRING_VALUE',
    GrantWrite: 'STRING_VALUE',
    GrantWriteACP: 'STRING_VALUE'
  };
  s3.putBucketAcl(aclParams, message);
};

const setBucketPolicy = (name) => {
  const params = { "Bucket": name };

  s3.getBucketPolicy(params, (err, data) => {
    if (err) { console.log("Error", err); } 
    else if (data) { console.log("Success", data.Policy); }
  });

  const readOnlyAnonUserPolicy = {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Sid": "AddPerm",
        "Effect": "Allow",
        "Principal": "*",
        "Action": [ "s3:GetObject" ],
        "Resource": [ "" ]
      }
    ]
  };

  const bucketResource = "arn:aws:s3:::" + name + "/*";
  readOnlyAnonUserPolicy.Statement[0].Resource[0] = bucketResource;

  const policyParams = { "Bucket": process.argv[2], "Policy": JSON.stringify(readOnlyAnonUserPolicy) };
  s3.putBucketPolicy(policyParams, message);
};

const deleteBucket = (name) => {
  const params = { "Bucket": name };
  s3.deleteBucket(params, message);
};


/****
 CLI 
****/
const cli = require('./cli.js');
switch (cli.command) {
  case 'buckets': listBuckets(); break;
  case  'create': createBucket(cli.resourceName); break;
  case  'upload': upload(cli.resourceName); break;
  case 'objects': listObjects(cli.resourceName); break;
  case  'access': setBucketPermissions(cli.resourceName); break;
  case  'policy': setBucketPolicy(cli.resourceName); break;
  case  'delete': deleteBucket(cli.resourceName); break;
  default       : console.error('Not a valid command!'); break;
}
