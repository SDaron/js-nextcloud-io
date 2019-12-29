const fs = require('fs')
const moment = require('moment')
const nextcloud = require('../index.js')
const config = require('./config.js')


nextcloud.getData(config).then(function(data) {

  results = JSON.stringify(data, null, 1);
  console.log(results);
  fs.writeFileSync('calendars.json', results);   //write data to a file

});

