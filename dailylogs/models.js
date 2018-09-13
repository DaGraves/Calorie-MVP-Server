'use strict';
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const DaySchema = mongoose.Schema({
  date: {type: Date},
  meal1: {type: String},
  meal2: {type: String},
  meal3: {type: String},
  snack: {type: String}
});


DaySchema.virtual('formattedDate').get(function() {
  let date = new Date(this.date);
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
});

DaySchema.methods.serialize = function () {
  return {
    id: this._id,
    date: this.formattedDate,
    meal1: this.meal1,
    meal2: this.meal2,
    meal3: this.meal3,
    snack: this.snack
  };
};



const Day = mongoose.model('Day', DaySchema);

module.exports = {Day};

