const app = require('express')();
const utils = require('./sick-utils.js')

app.get('/:instructor', (req, res)=> {
  let instructor = req.params.instructor.toLowerCase();

  // utils.getClassroomSchedule('cr6')
  //   .then(utils.parseYamlSchedule)
  //   .then(response => utils.genSchedule(response, instructor))
  utils.buildSchedule(instructor)
    .then(sched => res.send(sched) )
})

app.listen(3007, ()=>{
  console.log("live on port 3007");
})
