import React, { Component } from 'react';

import axios from 'axios';

const MESSAGE_LIMIT = 40;
const HEARTBEAT_INTERVAL = 3000;

class Channel extends Component {
  constructor(props) {
    super(props);

    let sender = localStorage.getItem('name');
    if (sender == null) {
      props.history.push('/'); 
    }

    this.state = {
      name: sender, 
      channel: props.match.params.name,
      messages: [],
      heartbeat: null,
      heartbeat_timestamp: new Date(),
      heartbeat_lock: false,
      form_message: ''
    }

    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.handleMessageSubmit = this.handleMessageSubmit.bind(this);
    this.doHeartbeat = this.doHeartbeat.bind(this);
  }

  componentDidMount() {
    function fetch_messages(self) {
      axios.get(`http://localhost:5000/api/messages?channel=${self.state.channel}&limit=${MESSAGE_LIMIT}`).then(res => {
        let messages = res.data.data;
        let heartbeat_id = setInterval(self.doHeartbeat, HEARTBEAT_INTERVAL);
        self.setState({messages : messages, heartbeat : heartbeat_id, heartbeat_timestamp: new Date()});
      }).catch(err => {
        if (err.response.status === 404) {
          axios.post("http://localhost:5000/api/channels", {
            name: self.state.channel 
          }).then(res => {
            fetch_messages(self);    
          });
        }
      });
    }

    fetch_messages(this); 
  }

  doHeartbeat() {
    if (this.state.heartbeat_lock) {
      return;
    }

    this.setState({ heartbeat_lock: true });

    axios.get(`http://localhost:5000/api/messages?channel=${this.state.channel}&after=${this.state.heartbeat_timestamp.toISOString()}`).then(res => {
      let new_messages = res.data.data;
      let messages = new_messages.concat(this.state.messages).slice(0, MESSAGE_LIMIT); 
      this.setState({ messages : messages, heartbeat_timestamp: new Date(), heartbeat_lock: false });
    });
  }

  handleMessageChange(event) {
    this.setState({ form_message : event.target.value });
  }

  handleMessageSubmit(event) {
    event.preventDefault();

    let message = this.state.form_message;
    if (message == null || message === '') {
      return;
    }

    axios.post("http://localhost:5000/api/messages", {
      sender: this.state.name,
      content: message,
      channel: this.state.channel 
    }).then(res => {
      this.doHeartbeat();
      document.getElementById("message-form").reset();
    });
  }

  render() {
    if (this.state.heartbeat == null) {
      return (
        <div className="container separation-large">
          <div className="row separation">
            <div className="twelve columns">
              <h2>Loading. Please be patient.</h2>
            </div>
          </div>
        </div>
      );
    }

    const red = {
      color: 'red'
    };
    
    return (
      <div className="container separation-large">
        <div className="row separation">
          <div className="twelve columns">
            <h2>Welcome ... to a chatroom! </h2>
            <h5>Your name is <i>{this.state.name}</i>. This channel is <i>{this.state.channel}</i>. You can access the home page from <a href="/">here.</a></h5>
          </div>
        </div>
        <div className="row separation">
          <div className="six columns">
            {this.state.messages.length > 0 ? this.state.messages.map(message => 
              <p key={message._id}><b>{message.sender}:</b> {message.content}</p>
            ) : <p style={red}>No messages in the channel yet.</p>}
          </div>
          <div className="six columns">
            <form onSubmit={this.handleMessageSubmit} id="message-form">
              <label>Message: </label>
              <input type="text" onChange={this.handleMessageChange}/><br/>
              <input type="submit" value="Submit"/>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Channel;
