const fs = require('fs');
const path = require('path');

const { message, readJSON, emptyBucket } = require('./utils.js');

/******************
 AWS Configuration 
******************/
const AWS = require('aws-sdk');
AWS.config.region = 'us-west-2';
AWS.config.apiVersions = { 's3': '2006-03-01' };

const s3 = new AWS.S3();

/**********
 Functions 
**********/
const createBucket = (name, acl) => {
 s3.createBucket({"Bucket": name, "ACL": acl}, message);
};

const listBuckets = () => {
 s3.listBuckets(message);
};

const upload = (name, filename) => {
  const fileStream = fs.createReadStream(filename);
  fileStream.on("error", err => console.log("File Error", err));
  const params = { "Bucket": name, "Key": path.basename(filename), "Body": fileStream };
  s3.upload(params, message);
};

const listObjects = (name) => {
  s3.listObjects({ "Bucket": name }, message);
};

const setBucketPolicy = (name, filename) => {
  const policy = readJSON(filename);
  if (policy) {
    policy.Statement[0].Resource[0] = `arn:aws:s3:::${name}/*`;
    const params = { "Bucket": name, "Policy": JSON.stringify(policy) };
    s3.putBucketPolicy(params, message);
  } else {
    console.log(`There was an error reading the file config/${filename}.json`);
  }
};

const getBucketPolicy = (name) => {
  s3.getBucketPolicy({"Bucket": name}, message);
};

const deleteBucket = async (name) => {
  const empty = await emptyBucket(name);
  if (empty) {
    s3.deleteBucket({"Bucket": name}, message);
  } else {
    console.log(`There was an error emptying the ${name} bucket.`);
  }
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
  case 'setpolicy': setBucketPolicy(cli.resource, cli.file_acl); break;
  case 'getpolicy': getBucketPolicy(cli.resource); break;
  case    'delete': deleteBucket(cli.resource); break;
  default         : console.error('Not a valid command!'); break;
}
