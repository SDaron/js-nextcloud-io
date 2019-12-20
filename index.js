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

			  let eventData = ical.parseICS(event.calendarData);
        let eventJson;

        for (let k in eventData) {
            if (eventData.hasOwnProperty(k)) {
                var ev = eventData[k];
                if (eventData[k].type == 'VEVENT') {
                    eventJSON = eventData[k];
                    const eventRange = moment.range(eventJSON['start'],eventJSON['end']);
                    if (eventRange.overlaps(calendarRange)){
                      calendarJSON.events.push(eventJSON);
                    }
                    break;
                }
            }
        }

      });

      results.calendars.push(calendarJSON);

    })

    output = results;

  });

  return output;

}
