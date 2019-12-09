# js-nextcloud-io
Small script to communicate with a nextcloud instance. Actually only a reader for contact and calendars.


## Example
```
const fs = require('fs')
const moment = require('moment')
const nextcloud = require('./index.js')

const config = {
    server: 'https://cloud.domain.tld',
    username: 'USERNAME', // Put yours
    password: 'XXXXXXXX', // Put yours 
    calendars: {
      'Activités' :{ // Name of the calendar to select
        start: moment().startOf('day'), // get events from today to...
        end: moment().endOf('day').add(52, 'weeks') // one year later
      }
    },
    debug:false
}

nextcloud.getData(config).then(function(data) {

  results = JSON.stringify(data, null, 1);
  console.log(results);
  fs.writeFileSync('calendars.json', results);   //write data to a file

});
```
