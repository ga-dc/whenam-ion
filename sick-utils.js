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

  daysJson = daysJson.map((dayWrapper, dayIndex)=>{
    let weekIndex = Math.floor(dayIndex / 5);
    let dayNum = weekIndex * 7 + dayIndex % 5;
    let date = moment(parsedDate, "YYYYMMDD").add(dayNum, "days");
    let wordedDate = date.format("MMMM Do YYYY");
    let sortDate = date.format("L");
    dayWrapper.day = dayWrapper.day.map((timeSlot, timeIndex)=>{
      for (var time in timeSlot) {
        timeSlot[time].classroom = `Classroom ${classRoomNum}`;
        timeSlot[time].date = wordedDate;
        timeSlot[time].sortDate = sortDate;
        timeSlot[time].time = time;
      }
      return timeSlot[time];
    })
    return dayWrapper.day;
  })
  .reduce(  (a,c) => a.concat(c) );
  return daysJson;
}

function buildSchedule (){
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
}

module.exports = {
  buildSchedule
}
