var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var { Channel, Message } = require('../models');

router.get('/', function(req, res) {
  // Parse limit field, bad requests are just returned with 400's
  let limit = parseInt(req.query.limit || '100', 10);
  if (limit < 1 || limit > 1000) {
    res.status(400).json({ error: true, message: 'Invalid limit.' });
    return;
  }

  // Find on ALL channels, remove MESSAGES array, sort by MESSAGE COUNT, limit by LIMIT 
  Channel
    .find({})
    .select('-messages')
    .sort('-message_count')
    .limit(limit)
    .exec((err, channels) => {
      if (err) {
        res.status(500).json({ error: true, message: err.message });
        return;
      }
      res.json({ success: true, data: channels });
    });
});

router.get('/:name', function(req, res) {
  let name = req.params.name; 
  if (name == null) {
    res.status(400).json({ error: true, message: 'Must specify a channel name.' });
    return;
  }

  // Find ONE channel, remove MESSAGES array
  Channel
    .findOne({ name : name })
    .select('-messages')
    .exec((err, channel) => {
      if (err) {
        res.status(500).json({ error: true, message: err.message });
        return;
      }
      else if (!channel) {
        res.status(404).json({ error: true, message: 'Channel not found.' });
        return;
      }
      res.json({ success: true, data: channel });
    });
});

router.post('/', function (req, res) {
  let name = req.body.name;
  if (name == null) {
    res.status(400).json({ error: true, message: 'Must specify a channel name.' });
    return;
  }

  // Check if channel exists before we try adding a new one
  Channel
    .count({ name : name })
    .exec((err, count) => {
      if (err) {
        res.status(500).json({ error: true, message: err.message });
        return;
      }
      else if (count > 0) {
        res.status(409).json({ error: true, message: 'Channel already exists.' });
        return;
      }

      /*
       * TODO:
       *
       * We want to create a channel object, using the `name` variable.
       * We then want to save this channel object, and send JSON indicating that
       * a success has occurred (or send error 500 if we crash).
       *
       * Hint: see the completed POST method routes/messages.js for inspiration.
       */

    });
});

module.exports = router;
