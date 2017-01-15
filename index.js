const app = require('express')();
const utils = require('./sick-utils.js')
const hbs = require('hbs');

app.set('view engine','hbs');
hbs.registerHelper('filter', utils.filterSchedule);

app.get('/', (req, res)=>{
  utils.buildSchedule().then( data => {
    console.log(data.length);
    res.send(data);
    // res.render('index', {data:data})} );
  })
})

app.get('/schedule', (req, res)=> {
  let instructor = req.params.instructor.toLowerCase();
  utils.buildSchedule(instructor).then(sched => res.send(sched) )
});

app.listen(3007, ()=>{
  console.log("live on port 3007");
});
