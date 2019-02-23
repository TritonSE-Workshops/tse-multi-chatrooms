const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChannelSchema = new Schema({
  name: String,
  messages: [{
    type: Schema.Types.ObjectId,
    ref: 'Message'
  }],
  message_count: Number 
});

/*
 * TODO:
 *
 * This schema has a bad field!
 *
 * We want to modify the 'channel' field, which is 
 * suppose to be a reference to a 
 * Channel object. You might get inspiration from
 * above ...
 */
const MessageSchema = new Schema({
  sender: String,
  content: String,
  channel: String, // This part seems a bit fishy ...
  created_at: Date 
});

const Channel = mongoose.model('Channel', ChannelSchema);
const Message = mongoose.model('Message', MessageSchema);

module.exports = {
  Channel,
  Message
}
