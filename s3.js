const fs = require('fs');
const path = require('path');

const { message } = require('./utils.js');

/******************
 AWS Configuration 
******************/



/**********
 Functions 
**********/
const listBuckets = () => {};

const createBucket = (name) => {};

const upload = (name, filename) => {};

const listObjects = (name) => {};

const getBucketPermissions = (name) => {};

const setBucketPermissions = (name, filename, acl) => {};

const getBucketPolicy = (name) => {};

const setBucketPolicy = (name) => {};

const deleteBucket = (name) => {};


/****
 CLI 
****/
const cli = require('./cli.js');
switch (cli.command) {
  case   'buckets': listBuckets(); break;
  case    'create': createBucket(cli.resourceName); break;
  case    'upload': upload(cli.resourceName, cli.secondaryResource); break;
  case   'objects': listObjects(cli.resourceName); break;
  case    'getacl': getBucketPermissions(cli.resourceName); break;
  case    'setacl': setBucketPermissions(cli.resourceName, cli.filename, cli.acl); break;
  case 'getpolicy': getBucketPolicy(cli.resourceName); break;
  case 'setpolicy': setBucketPolicy(cli.resourceName); break;
  case    'delete': deleteBucket(cli.resourceName); break;
  default         : console.error('Not a valid command!'); break;
}
