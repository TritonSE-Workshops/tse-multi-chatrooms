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

const MessageSchema = new Schema({
  sender: String,
  content: String,
  channel: {
    type: Schema.Types.ObjectId,
    ref: 'Channel'
  },
  created_at: Date 
});

const Channel = mongoose.model('Channel', ChannelSchema);
const Message = mongoose.model('Message', MessageSchema);

module.exports = {
  Channel,
  Message
}
