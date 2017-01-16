const app = require('express')();
const utils = require('./utils.js');
const cors = require('cors');

app.use(cors());

app.get('/schedule', (req, res)=> {
  utils.buildSchedule().then(  data => res.send( utils.sortByDate(data) )  );
});

app.listen(process.env.PORT || 3007, ()=>{
  console.log("live on port 3007");
});
