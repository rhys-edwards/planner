var express = require('express');
var router = express.Router();
var Entry = require('../models/entry.model');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/post', function(req, res, next) {
  var url = req.body.search;
  var title = req.body.title;
  var week = req.body.week;
  var month = req.body.month;
  var date = req.body.date;
  var selectedDate;

  console.log(url + ' ' + title + ' ' + week + ' ' + month + ' ' + date);

  //FIND WHICH DATE WAS SELECTED BY USER AND ASSIGN THAT TO selectedDate
  if (typeof week != 'undefined' ){
    var selectedDate = 'week';
  } else if (typeof month != 'undefined') {
    var selectedDate = 'month';
  } else {
    var selectedDate = specificDate;
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
  res.render('index');
  return false;
});


module.exports = router;
