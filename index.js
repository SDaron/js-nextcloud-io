const dav = require('dav')
const ical = require('ical')
const moment = require('moment')

exports.getData = getNextcloudData;

async function getNextcloudData(config){
  let calendars, xhr, output;
  const davServerURL = `${config.server}/remote.php/dav/`

  dav.debug.enabled = config.debug || false

  xhr = new dav.transport.Basic(
    new dav.Credentials({
      username: config.username,
      password: config.password
    })
  );
  let account = await dav.createAccount({
    server: davServerURL,
    xhr: xhr,
    loadObjects: true
  }).then(function(account) {

    let results = {};

    //Get calendars and events
    results.calendars = [];
    account.calendars.forEach(function (calendar) {
      if(config.calendars && !Object.keys(config.calendars).includes(calendar.displayName)){
        return false;
      }
      let calendarConfig = config.calendars[calendar.displayName] || {};
      let calendarJSON = {
        name: calendar.displayName,
        events: []
      }
      calendar.objects.forEach(function (event) {
			  let eventOBJ = ical.parseICS(event.calendarData);
			  let eventJSON = eventOBJ[Object.keys(eventOBJ)[0]];
        if (
          moment(eventJSON['start']).isBetween(calendarConfig['start'], calendarConfig['end']) ||
          moment(eventJSON['end']).isBetween(calendarConfig['start'], calendarConfig['end'])
        ){
          calendarJSON.events.push(eventJSON);
        }
      });
      results.calendars.push(calendarJSON);
    })
    output = results;
  });
  return output;
}
