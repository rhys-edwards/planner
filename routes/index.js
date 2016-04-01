var express = require('express');
var router = express.Router();
var Entry = require('../models/entry.model');
var mongodb = require('mongodb');
var mongoose = require('mongoose');
/* GET home page. */
// router.get('/', function(req, res, next) {
//  res.render('index', { title: 'Express' });
// });

router.get('/', function(req, res, next){
  Entry.find({}).sort('-date').exec(function(err, entries) {
    res.render('index', {
      "entries": entries
    });
  });
});

router.post('/post', function(req, res, next) {
  var url = req.body.search;
  var title = req.body.title;
  var anytime = req.body.anytime;
  var date = req.body.date;

  //FIND WHICH DATE WAS SELECTED BY USER AND ASSIGN THAT TO selectedDate
  if (typeof anytime != 'undefined' ){
    var selectedDate = 'anytime';
  } else {
    var selectedDate = date;
  };

  //CREATE NEW OBJECT
  var data = new Entry ({
    url: url,
    title: title,
    selectedDate: selectedDate
  })

  //STORE NEW OBJECT TO THE DB
  Entry.createEntry(data, function(err, entry){
    if (err) throw err;
    console.log(entry);
  })

  //RENDER THE HOMEPAGE TO CLEAR THE FORM
  Entry.find({}).sort('-date').exec(function(err, entries) {
    res.render('index', {
      "entries": entries
    });
  });
  return false;
});

//DATE STUFF
var date = new Date;
date.setDate(date.getDate() + 7);
console.log(date.toString());

// THIS WEEKEND
function thisWeekend(data) {
  var today = data.getDay();
  if (today == 6 || today == 0) {
    console.log('WEEKEND BITCHES');
  } else {
    console.log('Not the weekend');
  }
};

Entry.
  find({}).
  where('selectedDate').equals(thisWeekend(data)).
  exec(function(err, entries) {
  console.log('Events on a weeked' + ' ' + entries);

});

module.exports = router;
