const StateCaseModel = require('./seedState');
const CountyCaseModel = require('./seedCounty');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/nytimesCovidData', { useNewUrlParser: true, useUnifiedTopology: true });

const express = require('express');
const app = express();
app.use(express.json());

app.get('/counties', (req, res) => {
  CountyCaseModel.find()
    .then((data) => {
      res.send(data);
    })
})

app.get('/states', (req, res) => {
  StateCaseModel.find()
    .then((data) => {
      res.send(data);
    })
})

app.listen(3000, () => {
  console.log("listening on PORT 3000")
})