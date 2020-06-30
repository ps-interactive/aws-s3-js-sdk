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

const setBucketPolicy = (name, filename) => {
  const policy = readJSON(filename);
  if (policy) {
    policy.Statement[0].Resource[0] = "arn:aws:s3:::" + name + "/*";
    const params = { "Bucket": name, "Policy": JSON.stringify(policy) };
    s3.putBucketPolicy(params, message);
  } else {
    console.log(`There was an error reading the file config/${filename}.json`);
  }
};

const getBucketPolicy = (name) => {
  s3.getBucketPolicy({ "Bucket": name }, message);
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
  case   'buckets': listBuckets(); break;
  case    'create': createBucket(cli.resource, cli.file_acl); break;
  case    'upload': upload(cli.resource, cli.file_acl); break;
  case   'objects': listObjects(cli.resource); break;
  case 'getpolicy': getBucketPolicy(cli.resource); break;
  case 'setpolicy': setBucketPolicy(cli.resource, cli.file_acl); break;
  case    'delete': deleteBucket(cli.resource); break;
  default         : console.error('Not a valid command!'); break;
}
