const axios = require('axios');
const parsey = require('js-yaml');
const moment = require('moment')

function getClassroomSchedule (n){
  return axios.get(`https://raw.githubusercontent.com/ga-dc/${n}/master/schedule.yml`)
}

function parseYamlSchedule(response, classRoomNum) {
  if (response.status >= 400) {
    throw new Error("Bad response from server");
  }
  let parsedResponse = parsey.load(response.data);
  let daysJson = parsedResponse[1].days;
  let parsedDate = parsedResponse[0]["start-date"].replace(/-/g,"");
  let startDate = new Date(parsedDate);
  // console.log(startDate, daysJson.length, classRoomNum);
  daysJson = daysJson.map((dayWrapper, index)=>{
    let date = moment(parsedDate, "YYYYMMDD").add(index, "days").format("MMMM Do YYYY");
    dayWrapper.day = dayWrapper.day.map((timeSlot)=>{
      for (var time in timeSlot) {
        timeSlot[time].classroom = `Classroom ${classRoomNum}`;
        timeSlot[time].date = date;
        // console.log(timeSlot[time]);
      }
      return timeSlot;
    })
    return dayWrapper;
  })
  return daysJson;
}

function genSchedule (dates, instructor) {
  let schedule = []
  dates.forEach(date => {
    date.day.forEach(timeSlot => {
      for (let time in timeSlot) {
        if (timeSlot[ time ].lead &&
            timeSlot[ time ].lead.toLowerCase() === instructor ) {
          schedule.push( timeSlot[time] ) ;
        } else if (timeSlot[ time ].support &&
            timeSlot[ time ].support.toLowerCase() === instructor ) {
          schedule.push( timeSlot[time] ) ;
        }
      }
    })
  })
  return schedule;
}

function buildSchedule (instructor){
  let axiosCalls = [
    getClassroomSchedule('cr5'),
    getClassroomSchedule('cr6')
  ]
  return axios.all(axiosCalls)
  .then(axios.spread((cr5, cr6)=>{
    return (
      parseYamlSchedule(cr5, 5)
      .concat(
        parseYamlSchedule(cr6, 6)
      )
    )
  }))
  .then(response => genSchedule(response, instructor)).catch(e => {
  })
}

module.exports = {
  genSchedule,
  getClassroomSchedule,
  parseYamlSchedule,
  buildSchedule
}
