'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const {Day} = require('./models');

const router = express.Router();

const jsonParser = bodyParser.json();

const passport = require('passport');

const objectId = mongoose.Schema.Types.ObjectId;


//protect routes
const jwtAuth = passport.authenticate('jwt', {
  session: false
});

router.use(jwtAuth);

router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['date', 'meal1', 'meal2', 'meal3', 'snack'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body.`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Day
    .create({
      date: req.body.date,
      meal1: req.body.meal1,
      meal2: req.body.meal2,
      meal3: req.body.meal3,
      snack: req.body.snack,
    })
    .then(
      dailyLogs => res.status(200).json(dailyLogs.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({
        message: 'Internal server error'
      });
    });

});

router.get('/', jsonParser, (req, res) => {
  Day
    .find()
    .then(dailyLogs => {
      res.json({
        dailyLogs: dailyLogs.map((day) => day.serialize())
      });
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({
          message: 'Internal server error'
        });
      });
});


router.delete('/:id', (req, res) => {
  Day.
    findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch(err => res.status(500).json({
      message: 'Internal server error'
    }));
});


module.exports = {router};