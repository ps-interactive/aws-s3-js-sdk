const fs = require('fs');
const path = require('path');

const { message } = require('./utils.js');

const AWS = require('aws-sdk');
AWS.config.region = 'us-west-2';
AWS.config.apiVersions = { 's3': '2006-03-01' };

const s3 = new AWS.S3();

const listBuckets = () => {
  s3.listBuckets((err, data) => { 
    if (err) { console.log("Error", err); }
    else { console.log("Success", data.Buckets); }
  });
};

const createBucket = (name) => {
  s3.createBucket({ "Bucket": name }, message);
};

const upload = (bucket, name) => {
  const params = { "Bucket": bucket, "Key": "", "Body": "" };
  const fileStream = fs.createReadStream(name);
  fileStream.on("error", err => console.log("File Error", err));
  
  params.Body = fileStream;
  params.Key = path.basename(name);

  s3.upload(params,  (err, data) => {
    if (err) { console.log("Error", err); } 
    else { console.log("Upload Success", data.Location); }
  });
};

const listObjects = (name) => {
  s3.listObjects({ "Bucket": name }, message);
};

const getBucketPermissions = (name) => {
  s3.getBucketAcl({ "Bucket": name }, message);
};

const setBucketPermissions = (name, acl, filename) => {
  const policy = readJSON(filename);
  const aclParams = { "Bucket": name, "ACL": acl, "AccessControlPolicy": policy };
  s3.putBucketAcl(aclParams, message);
};

const getBucketPolicy = (name) => {
  s3.getBucketPolicy({ "Bucket": name }, message);
};

const setBucketPolicy = (name) => {
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
  case  'upload': upload(cli.resourceName, cli.secondaryResource); break;
  case 'objects': listObjects(cli.resourceName); break;
  case  'getacl': getBucketPermissions(cli.resourceName); break;
  case  'setacl': setBucketPermissions(cli.resourceName); break;
  case  'getpolicy': getBucketPolicy(cli.resourceName); break;
  case  'setpolicy': setBucketPolicy(cli.resourceName); break;
  case  'delete': deleteBucket(cli.resourceName); break;
  default       : console.error('Not a valid command!'); break;
}
