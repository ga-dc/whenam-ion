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
  console.log("in genSchedule");
  console.log(dates);
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
  return schedule
}

function buildSchedule (instructor){
  let axiosCalls = [
    getClassroomSchedule('cr5'),
    getClassroomSchedule('cr6')
  ]
  return axios.all(axiosCalls)
    .then(axios.spread((cr5, cr6)=>{
      return (
        parseYamlSchedule(cr5)
          .concat(
            parseYamlSchedule(cr6)
          )
      )
    }))
    .then(response => genSchedule(response, instructor)).catch(e => {
      console.log(e);
    })
}

module.exports = {
  genSchedule,
  getClassroomSchedule,
  parseYamlSchedule,
  buildSchedule
}
