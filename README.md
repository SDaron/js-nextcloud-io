# js-nextcloud-io

Small script to communicate with a nextcloud instance from nodeJS. Actually only a reader for calendars.


## Example

```
const fs = require('fs')
const moment = require('moment')
const nextcloud = require('./index.js')

const config = {
    server: 'https://cloud.domain.tld',
    username: 'USERNAME', // Put yours
    password: 'XXXXXXXX', // Put yours 
    calendars: { // Leave empty to get all data
      Personal' :{ // Name of the calendar to select
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

### Output

```
{
 "calendars": [
  {
   "name": "Personal",
   "events": [
    {
     "type": "VEVENT",
     "params": [],
     "created": "2019-12-06T08:26:29.000Z",
     "dtstamp": "2019-12-06T08:26:29.000Z",
     "lastmodified": "2019-12-06T08:26:29.000Z",
     "uid": "UEOXNDJDJJLA2GWXTTW2BD",
     "summary": "Title of the event",
     "location": "Location",
     "class": "PUBLIC",
     "description": "Lorem ipsum dolor sit amet",
     "status": "CONFIRMED",
     "start": "2020-04-08T22:00:00.000Z",
     "end": "2020-04-12T22:00:00.000Z"
    }
   ]
  }
 ]
}
```
