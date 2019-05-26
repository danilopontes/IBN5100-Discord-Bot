var mongoosedb = require('mongoose');
require('dotenv').config();

mongoosedb.Promise = global.Promise;
mongoosedb.connect(process.env.DB, {useNewUrlParser: true}, (err) => {
  if(err){
    console.log(err);
  } else {
    console.log("DB connected!");
  }
});

module.exports = mongoosedb;