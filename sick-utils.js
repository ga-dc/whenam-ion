const axios = require('axios');
const parsey = require('js-yaml');

function getClassroomSchedule (n){
  return axios.get(`https://raw.githubusercontent.com/ga-dc/${n}/master/schedule.yml`)
}

function parseYamlSchedule(response) {
  if (response.status >= 400) {
    throw new Error("Bad response from server");
  }
  return parsey.load(response.data)[1].days
}

function genSchedule (dates, instructor) {
  let schedule = []
  dates.forEach(date => {
    date.day.forEach(timeSlot => {
      for (let someKey in timeSlot) {
        if( timeSlot[ someKey ].lead) {
          if (timeSlot[ someKey ].lead.toLowerCase() === instructor){
            schedule.push( timeSlot[someKey] ) ;
          }
        }
      }
    })
  })
  console.log(schedule);
  return schedule
}

module.exports = {
  genSchedule,
  getClassroomSchedule,
  parseYamlSchedule
}

// axios.all([ getClassroomSchedule('cr6'), getClassroomSchedule('cr5') ])
