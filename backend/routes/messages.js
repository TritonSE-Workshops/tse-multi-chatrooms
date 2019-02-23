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

  // Always limit messages by channel 
  let channel_name = req.query.channel;
  if (channel_name == null) {
    res.status(400).json({ error: true, message: 'Must specify a channel name.' });
    return;
  }

  // Find the channel associated with the given channel name 
  Channel
    .findOne({ name : channel_name })
    .select('-messages -message_count')
    .exec((err, channel) => { if (err) {
        res.status(500).json({ error: true, message: err.message });
        return;
      }
      else if (!channel) {
        res.status(404).json({ error: true, message: 'Channel not found.' });
        return;
      }

      // Construct basic query: find all messages associated with a channel
      let query = Message.find({ channel: channel._id });

      // Sometimes, we only want messages after a certain given date
      if ('after' in req.query) {
        let cutoff_date = new Date(req.query.after);
        query = Message.find({ channel: channel._id, created_at: { "$gte" : cutoff_date } });
      }

      // Sort messages by date regardless
      query = query.sort('-created_at');

      // Limit number of messages we can get
      query = query.limit(limit);

      query.exec((err, messages) => {
        if (err) {
          res.status(500).json({ error: true, message: err.message });
          return;
        }
        res.json({ success: true, data: messages });
      });
    });
});

router.post('/', function (req, res) {
  // Make sure we have a channel name to post to
  let channel_name = req.body.channel;
  if (channel_name == null) {
    res.status(400).json({ error: true, message: 'Must specify a channel name.' });
    return;
  }

  // Make sure we have message information 
  let message_sender = req.body.sender;
  let message_content = req.body.content;
  if (message_sender == null || message_content == null) {
    res.status(400).json({ error: true, message: 'Must specify message content and sender.' });
    return;
  }

  // Find the channel associated with the given channel name 
  Channel
    .findOne({ name : channel_name })
    .exec((err, channel) => {
      if (err) {
        res.status(500).json({ error: true, message: err.message });
        return;
      }
      else if (!channel) {
        res.status(404).json({ error: true, message: 'Channel not found.' });
        return;
      }

      // Construct new message given the channel object, sender name, and message content 
      let message = new Message({
        sender: message_sender,
        content: message_content,
        channel: channel._id,
        created_at: Date.now() 
      });

      // Save the message into the database
      message.save((err, message) => {
        if (err) {
          res.status(500).json({ error: true, message: err.message });
          return;
        }

        // Associate message with the channel object (reverse direction) and increase message count 
        channel.messages.push(message);
        channel.message_count++;

        // Save updated channel into the database
        channel.save((err, channel) => {
          if (err) {
            res.status(500).json({ error: true, message: err.message });
            return;
          }

          res.json({ success : true, data: message }); 
        });
      });
    });
});

module.exports = router;
