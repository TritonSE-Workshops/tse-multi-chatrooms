var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var env = require('node-env-file');
var cors = require('cors');

// Load environment variables
env(path.join(__dirname, '.env'));

// Connect to MongoDB database
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });

// Initialize Express application
var app = express();

// Allow CORS
app.use(cors());
app.options('*', cors());

// Set up view engine 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Setting up logging
app.use(logger('combined'));

// Parse application/json or application/x-www-formurlencoded message bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Allow for parsing of cookies (not used)
app.use(cookieParser());

// Set public directory for resources (not used)
app.use(express.static(path.join(__dirname, 'public')));

// Setup API routes
app.use('/api/channels', require('./routes/channels'));
/*
 * TODO: Add a route for /api/messages
 */

// Set the server port 
app.set('port', (process.env.PORT || 5000));

// Start the server
app.listen(app.get('port'), () => {
  console.log(`Server is running on port ${app.get('port')}`);
});
