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

  var dateObj = new Date(date);
  var isoDate = dateObj.toISOString()
  console.log(isoDate + ' ' + 'step 1')
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
  Entry.find({}).sort('-date').exec(function(err, entries) {
    res.render('index', {
      "entries": entries
    });
  });
  return false;
});

// THIS WEEKEND
Entry.aggregate(
    [
        { "$redact": {
            "$cond": {
                "if": {
                    "$or": [
                        { "$eq": [ { "$dayOfWeek": "$selectedDate" }, 1 ] },
                        { "$eq": [ { "$dayOfWeek": "$selectedDate" }, 7 ] }
                    ]
                },
                "then": "$$KEEP",
                "else": "$$PRUNE"
            }
        }}
    ],
    function(err,results) {
      if (err) throw err;
      console.log(results);

      function matchWeekend(fruit) {
          return fruit.selectedDate == 'Sun Apr 10 2016 00:00:00 GMT+0100 (BST)';
      }

      console.log(results.find(matchWeekend))
    }
)
 // { name: 'cherries', quantity: 5 }

module.exports = router;
