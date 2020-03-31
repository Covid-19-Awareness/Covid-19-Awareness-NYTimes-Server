const mongoose = require('mongoose');
const fs = require('fs');
const fastcsv = require('fast-csv');

// Connect to database
mongoose.connect('mongodb://localhost:27017/nytimesCovidData', { useNewUrlParser: true, useUnifiedTopology: true });

// Drop collection before seeding
const connection = mongoose.connection;

connection.once('open', () => {
  console.log("MongoDB connected successfully");
  
  connection.db.listCollections().toArray((err, names) => {
    if(err) {
      console.error(err);
    } else {
      for (let name of names) {
        // Drop collection - counties if exist
        if (name.name === 'states') {
          console.log('Collection - states found');
          connection.db.dropCollection('states', (err, res) => {
            console.log( `Collection - states dropped`);
          });
        } 
      }
    }
  })
})



const Schema = mongoose.Schema;

const SchemaForState = new Schema({
  date: Date,
  state: String,
  fips: Number,
  cases: Number,
  deaths: Number
})

const StateCaseModel = mongoose.model('states', SchemaForState);

// seed data into MongoDB
let stream = fs.createReadStream(__dirname + '/covid-19-data/us-states.csv');
let csvData = [];
let csvStream = fastcsv
  .parse()
  .on('data', (data) => {
    csvData.push({
      date: data[0],
      state: data[1],
      fips: data[2],
      cases: data[3],
      deaths: data[4],
    })
  })
  .on('end', () => {
    // remove the header
    csvData.shift();

    // save to database
    StateCaseModel.insertMany(csvData, (err, res) => {
      if(err) throw err;
      console.log(`Inserted: ${res.length} rows`);
      // connection.close();
    })
  });

  stream.pipe(csvStream);



module.exports = StateCaseModel;



