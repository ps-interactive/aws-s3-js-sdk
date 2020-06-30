const fs = require('fs');

const message = (err, data) => {
  if (err) { console.log(`Error: ${err.message}`); }
  else if (data) { console.log(`Success: ${JSON.stringify(data, null, 2)}`); }
};

const readJSON = (filename) => fs.existsSync(`policies/${filename}.json`) ? JSON.parse(fs.readFileSync(`policies/${filename}.json`)) : undefined;

module.exports = { message, readJSON };

