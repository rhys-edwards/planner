var express = require('express');
var router = express.Router();
var Entry = require('../models/entry.model');
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var moment = require('moment-timezone');
/* GET home page. */
// router.get('/', function(req, res, next) {
//  res.render('index', { title: 'Express' });
// });

router.get('/', function(req, res, next){
  weekendPlans(function(err, theWeekend) {
      if (err) throw err
      console.log(theWeekend);
      res.render('index', {"theWeekend" : theWeekend});
  })
  // Entry.find({}).sort('-date').exec(function(err, entries) {
  //   res.render('index', {
  //     "entries": entries
  //   });
  // });
});

router.post('/post', function(req, res, next) {
  var url = req.body.search;
  var title = req.body.title;
  var anytime = req.body.anytime;
  var date = req.body.date;

  // CONVERT DATE TO LONDON TIME (THIS WONT LAST)
  var london = moment.tz(date, "Europe/London");

  // CONVERT DATE TO ISODATE FOR MONGO
  var dateObj = new Date(london);
  var isoDate = dateObj.toISOString()

  //FIND WHICH DATE WAS SELECTED BY USER AND ASSIGN THAT TO selectedDate
  if (typeof anytime != 'undefined' ){
    var selectedDate = 'anytime';
  } else {
    var selectedDate = isoDate;
    console.log(selectedDate + ' ' + 'step 2')
  };

  console.log(selectedDate + ' ' + 'step 3')

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
  weekendPlans(function(err, theWeekend) {
      if (err) throw err
      console.log(theWeekend);
      res.render('index', {"theWeekend" : theWeekend});
  });
  return false;
});

// DETERMINE THE DATES FOR THIS WEEKEND
var yesterday = new Date();
yesterday.setDate(yesterday.getDate());
var dowOffset = (yesterday.getUTCDay() - 1) % 7;
var thisWeekStart = new Date(yesterday);
thisWeekStart.setDate(thisWeekStart.getDate() - dowOffset);
var thisWeekEnd = new Date(thisWeekStart);
var friday = new Date(thisWeekStart);
var saturday = new Date(thisWeekStart);
var sunday  = new Date(thisWeekStart);
friday.setDate(thisWeekEnd.getDate() + 4);
saturday.setDate(thisWeekEnd.getDate() + 5);
sunday.setDate(thisWeekEnd.getDate() + 6);

// THESE DATES ARE CORRECT
console.log(friday);
console.log(saturday);
console.log(sunday);

//FIND ALL ENTRIES THAT FALL ON A WEEKEND
function weekendPlans(callback) {
  Entry.aggregate(
      [
          { "$redact": {
              "$cond": {
                  "if": {
                      "$or": [
                          { "$eq": [ { "$dayOfWeek": "$selectedDate" }, 1 ] },
                          { "$eq": [ { "$dayOfWeek": "$selectedDate" }, 6 ] },
                          { "$eq": [ { "$dayOfWeek": "$selectedDate" }, 7 ] }
                      ]
                  },
                  "then": "$$KEEP",
                  "else": "$$PRUNE"
              }
          }}
      ],
      // GET THE RESULTS AND RETURN IF selectedDate MATCHES THIS WEEKEND
      function(err,results) {
        var i = results.length;
        var theWeekend;

        while(i--) {
          if(results[i].selectedDate === friday || saturday || sunday) {
              theWeekend = results[i];
              break;
          }
        }
        callback(err, theWeekend)
      }
)};


module.exports = router;
