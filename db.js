const mongoose = require('mongoose');
const { db } = require('./config.json');

mongoose.Promise = global.Promise;
mongoose.connect(db, {useNewUrlParser: true, useFindAndModify: false}, (err) => {
  if(err){
    console.log(err);
  } else {
    console.log("DB connected!");
  }
});

module.exports = mongoose;