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
  Entry.find({}, function (err, entries) {
    res.render('index', {
      "entries": entries
    });
  });
});

router.post('/post', function(req, res, next) {
  var url = req.body.search;
  var title = req.body.title;
  var week = req.body.week;
  var month = req.body.month;
  var date = req.body.date;

  console.log(url + ' ' + title + ' ' + week + ' ' + month + ' ' + date);

  //FIND WHICH DATE WAS SELECTED BY USER AND ASSIGN THAT TO selectedDate
  if (typeof week != 'undefined' ){
    var selectedDate = 'week';
  } else if (typeof month != 'undefined') {
    var selectedDate = 'month';
  } else {
    var selectedDate = date;
  };

  if (selectedDate == 'week') {
    var date = new Date;
    console.log('1' + ' ' + date);
    date.setDate(date.getDate() + 7);
    console.log('2' + ' ' + date);
    var selectedDate = date.toString();
  };

  console.log('hello' + ' ' + selectedDate);

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
  Entry.find({}, function (err, entries) {
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

// var date = new Date();
// date.setDate(date.getDate() + 7);
//
// var dateMsg = date.getDate()+'/'+ (date.getMonth()+1) +'/'+date.getFullYear();
// alert(dateMsg);


module.exports = router;
