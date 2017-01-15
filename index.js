const app = require('express')();
const utils = require('./sick-utils.js')
const hbs = require('hbs');

app.set('view engine','hbs');
hbs.registerHelper('filter', utils.filterSchedule);

app.get('/', (req, res)=>{
  utils.buildSchedule().then( data => {
    // data = data.sort((a,b)=>{
    //   if (a.sortDate < b.sortDate) {
    //     return -1;
    //   }
    //   if (a.sortDate > b.sortDate) {
    //     return 1;
    //   }
    //   return 0;
    // })

  res.render('index', {data})
  } );
} );

app.get('/schedule', (req, res)=> {
  utils.buildSchedule().then( data => res.send(data) );
});

app.listen(3007, ()=>{
  console.log("live on port 3007");
});
