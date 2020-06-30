const fs = require('fs');

const message = (err, data) => {
  if (err) { console.log(`Error: ${err.message}`); }
  else if (data) { console.log(`Success: ${JSON.stringify(data)}`); }
};

const readJSON = (filename) => fs.existsSync(`config/${filename}.json`) ? JSON.parse(fs.readFileSync(`config/${filename}.json`)) : undefined;

module.exports = { message, readJSON };

