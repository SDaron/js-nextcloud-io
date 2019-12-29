const moment = require('moment');
module.exports = {
    server: 'https://cloud.domain.tld',
    username: 'USERNAME', // Put yours
    password: 'XXXXXXXX', // Put yours 
    calendars: { // Leave empty to get all data
      'Personal' :{ // Name of the calendar to select
        start: moment().startOf('day'), // get events from today to...
        end: moment().endOf('day').add(52, 'weeks') // one year later
      }
    },
    debug:false
}
