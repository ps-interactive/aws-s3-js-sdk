const parse = require('minimist')(process.argv.slice(2));
const command = parse._[0];
const resourceName = parse._[1];
const secondaryResource = parse._[2];

module.exports = { command, resourceName, secondaryResource };
