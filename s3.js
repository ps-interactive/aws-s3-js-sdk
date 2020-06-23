const { message, readJSON, sortSubnets } = require('./utils.js');

const createBucket = (name) => {};

const listBuckets = (name) => {};

const upload = (name) => {};

const addBucketPermissions = (name) => {};

const addBucketPolices = (name) => {};

const deleteBucket = (name) => {};


/****
 CLI 
****/
const cli = require('./cli.js');
switch (cli.command) {
  case 'create': createBucket(cli.resourceName); break;
  case   'list': listBuckets(cli.resourceName); break;
  case 'upload': upload(cli.resourceName); break;
  case 'access': addBucketPermissions(cli.resourceName); break;
  case 'policy': addBucketPolices(cli.resourceName); break;
  case 'delete': deleteBucket(cli.resourceName); break;
  default      : console.error('Not a valid command!'); break;
}
