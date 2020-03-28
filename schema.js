const mongoose = require('mongoose');

//connect to database
mongoose.connect('mongodb://localhost:27017/nytimesCovidData', { useNewUrlParser: true, useUnifiedTopology: true });

//drop collection before seeding
const connection = mongoose.connection;

connection.once('open', () => {
  console.log("MongoDB connected successfully");
  
  connection.db.listCollections().toArray((err, names) => {
    if(err) {
      console.error(err);
    } else {
      for (let name in names) {
        if (name.name === 'nytCovidCases') {
          console.log('Collection: nytCovidCases found');
          connection.db.dropCollection('nytCovidCases', (err, res) => {
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

const caseSchema = new Schema({
  date: Date,
  country: String,
  state: String,
  fips: Number,
  cases: Number,
  deaths: Number
})

const NYTModel = mongoose.model('nytCovidCases', caseSchema);

// const Cases = new NYTModel();