var express = require('express')
var path = require('path')
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var users = require('./routes/users');
var scrape = require('html-metadata');
var request = require('request');
var mongodb = require('mongodb');
var mongoose = require('mongoose');


var db = mongoose.connection;
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
//app.use('/submit', submit);

// GET VALUE FROM SEARCH AND SCRAPE URL FOR TITLE
app.get('/searching', function(req, res){

 // INPUT VALUE FROM SEARCH
 var val = req.query.search;
 console.log(val);

// STORE THE VALUE AS THE URL
 var url = val;
 var options = {
   url: url,
   headers: {
     'User-Agent': 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US) AppleWebKit/525.19 (KHTML, like Gecko) Chrome/0.2.153.1 Safari/525.19'
   }
 };

 scrape(options, function(error, metadata) {
   console.log(metadata);
   if (typeof metadata.general.title != 'undefined') {
     var title = metadata.general.title;
   } else {
      var title = metadata.openGraph.title;
   }
  //  console.log('The title is' + ' ' + title);
  res.send(title);
 });
});

app.get('/dblisting', function(req,res){
  console.log('hello')
   Entry.find({ selectedDate: 'value'}, function(err, entries) {
      if (err) {
         res.send(err.message);
      } else {
        console.log(entries);
      }
    });
  });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
