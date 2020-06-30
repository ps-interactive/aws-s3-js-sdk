const fs = require('fs');
const path = require('path');

const { message, readJSON } = require('./utils.js');

/******************
 AWS Configuration 
******************/


/**********
 Functions 
**********/
const createBucket = (name) => {};

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
  case    'create': createBucket(cli.resourceName); break;
  case    'upload': upload(cli.resourceName, cli.filename); break;
  case   'objects': listObjects(cli.resourceName); break;
  case 'getpolicy': getBucketPolicy(cli.resourceName); break;
  case 'setpolicy': setBucketPolicy(cli.resourceName, cli.filename); break;
  case    'delete': deleteBucket(cli.resourceName); break;
  default         : console.error('Not a valid command!'); break;
}
