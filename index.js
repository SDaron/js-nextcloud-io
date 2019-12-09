const ical = require('ical')
const dav = require('dav')

const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);

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
      let calendarCfg = config.calendars[calendar.displayName] || {};
      let calendarJSON = {
        name: calendar.displayName,
        events: []
      }
      let calendarRange = moment.range(calendarCfg['start'], calendarCfg['end'] || 8640000000000000);

      calendar.objects.forEach(function (event) {

			  let eventOBJ = ical.parseICS(event.calendarData);
			  let eventJSON = eventOBJ[Object.keys(eventOBJ)[0]];
        // First case, no end date, select future and current events
        let selected = true;
        const eventRange = moment.range(eventJSON['start'],eventJSON['end']);
        if (eventRange.overlaps(calendarRange)){
          calendarJSON.events.push(eventJSON);
        }

      });

      results.calendars.push(calendarJSON);

    })

    output = results;

  });
  return output;
}
