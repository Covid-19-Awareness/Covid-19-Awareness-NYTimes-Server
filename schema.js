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
        if (name.name === 'nytcovidcases') {
          console.log('Collection: nytcovidcases found');
          connection.db.dropCollection('nytcovidcases', (err, res) => {
            console.log( `Collection: ${name.name} dropped`);
          });
        } else {
          console.log('Collection does not exist');
        }
      }
    }
  })
})

const Schema = mongoose.Schema;

const SchemaForCounty = new Schema({
  date: Date,
  country: String,
  state: String,
  fips: Number,
  cases: Number,
  deaths: Number
})

const CountyCaseModel = mongoose.model('nytCovidCases', SchemaForCounty);

// seed data into MongoDB
let stream = fs.createReadStream(__dirname + '/covid-19-data/us-counties.csv');
let csvData = [];
let csvStream = fastcsv
  .parse()
  .on('data', (data) => {
    csvData.push({
      date: data[0],
      county: data[1],
      state: data[2],
      fips: data[3],
      cases: data[4],
      deaths: data[5],
    })
  })
  .on('end', () => {
    // remove the header
    csvData.shift();

    // save to database
    CountyCaseModel.insertMany(csvData, (err, res) => {
      if(err) throw err;
      console.log(`Inserted: ${res.length} rows`);
      connection.close();
    })
  });

  stream.pipe(csvStream);



module.exports = CountyCaseModel;