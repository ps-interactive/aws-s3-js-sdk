const fs = require('fs');
const path = require('path');

const { message, readJSON } = require('./utils.js');

/******************
 AWS Configuration 
******************/


/**********
 Functions 
**********/
const createBucket = (name, acl) => {};

const listBuckets = () => {};

const upload = (name, filename) => {};

const listObjects = (name) => {};

const getBucketPolicy = (name) => {};

const setBucketPolicy = (name, filename) => {};

const deleteBucket = (name) => {};


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
