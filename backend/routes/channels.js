var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var { Channel, Message } = require('../models');

router.get('/', function(req, res) {
  // Parse limit field, bad requests are just returned with 400's
  let limit = parseInt(req.query.limit || '100', 10);
  if (limit < 1 || limit > 100) {
    res.status(400).json({ error: true, message: 'Invalid limit.' });
    return;
  }

  // Find on ALL channels, remove MESSAGES array, sort by MESSAGE COUNT, limit by LIMIT 
  Channel
    .find({})
    .select('-messages')
    .sort('message_count')
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

      // Channel does not exist, so we define a new instance of the channel model
      var channel = new Channel({
        name: name,
        messages: [],
        message_count: 0
      });

      // Save the instance to our database
      channel.save((err, channel) => {
        if (err) {
          res.status(500).json({ error: true, message: err.message });
          return;
        }
        res.json({ success: true, data: channel });
      });
    });
});

module.exports = router;
