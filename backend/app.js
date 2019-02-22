var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var env = require('node-env-file');

// Load environment variables
env(path.join(__dirname, '.env'));

// Connect to MongoDB database
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });

// Initialize Express application
var app = express();

// Set up view engine 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Setting up logging
app.use(logger('combined'));

// Parse application/json or application/x-www-formurlencoded message bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Allow for parsing of cookies
app.use(cookieParser());

// Set public directory for resources (not used)
app.use(express.static(path.join(__dirname, 'public')));

// Setup API routes
app.use('/api/channels', require('./routes/channels'));
app.use('/api/messages', require('./routes/messages'));

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Set the server port 
app.set('port', (process.env.PORT || 5000));

// Start the server
app.listen(app.get('port'), () => {
  console.log(`Server is running on port ${app.get('port')}`);
});
