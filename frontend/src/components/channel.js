import React, { Component } from 'react';

import axios from 'axios';

const MESSAGE_LIMIT = 40;
const HEARTBEAT_INTERVAL = 3000;

class Channel extends Component {
  constructor(props) {
    super(props);

    // If the user hasn't provided a name, 
    // (i.e) JS local storage can't find a name,
    // then we want to issue a redirect back to the home page.
    let sender = localStorage.getItem('name');
    if (sender == null) {
      props.history.push('/'); 
    }

    // Set up initial state
    this.state = {
      name: sender, 
      channel: props.match.params.name,
      messages: [],
      heartbeat: null,
      heartbeat_timestamp: new Date(),
      heartbeat_lock: true,
      form_message: ''
    }

    // Add bindings for the message field
    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.handleMessageSubmit = this.handleMessageSubmit.bind(this);

    // Add binding for the heartbeat function
    this.doHeartbeat = this.doHeartbeat.bind(this);
  }

  componentDidMount() {
    /*
     * TODO:
     *
     * After we are done with an initial render, we want to use 
     * axios to make a maximum of 2 calls to the backend server
     * to retrieve and update some data. We'll walk through the different
     * scenarios.
     *
     * 1) Let's say that the current channel (this.state.channel) has a 
     * channel object already associated with it on the backend. We want
     * to retrieve the {MESSAGE_LIMIT} most recent messages that the channel owns.
     * That is, we want to issue:
     *
     * GET http://localhost:5000/api/messages?channel={CHANNEL}&limit=${LIMIT}
     *
     * You are going to use Axios to do this. Since the channel exists, you can 
     * expect that the backend will return a list of messages in res.data.data
     * where res is the response object that Axios returns. You will need to 
     * save these messages to the state, and then create a 'heartbeat' polling
     * function to continuously fetch new messages. Fortunately, this function has 
     * already been written for you (self.doHeartbeat), so all there is left is to
     * initialize the interval and then make the correct setState() call. NOTE: 
     * you'll want to set four things during the state change ... messages,
     * heartbeat, heartbeat_timestamp, heartbeat_lock.
     *
     * 2) Conversely, let's say that this channel is entirely new, such that when
     * we make the GET call above, we get a 404, indicating that there is no channel
     * object by the name of ${self.state.channel}. In this case, we need to make a POST
     * request to the proper URL with the correct information (just the channel name). The
     * structure of the request will look like this:
     *
     * POST http://localhost:5000/api/channels 
     * with body = { name: self.state.channel }
     *
     * This should always return a success. You'll then need to redo #1 without the
     * GET request, since you can assume for a newly created channel that the number of
     * messages it has is 0 (therefore, the messages array will be empty).
     */
  }

  doHeartbeat() {
    // This is a primitive lock used to ensure that no other
    // interval updates the messages as we are calling this method
    if (this.state.heartbeat_lock) {
      return;
    }

    // Current interval locks the function, unlocks after parsing the GET request 
    this.setState({ heartbeat_lock: true });

    // In the heartbeat function, we want to fetch any messages that were created
    // after the last time we updated the heartbeat timestamp date. This ensures
    // that we're not fetching redundant data, and we're updating in the most 'efficient'
    // way possible.
    axios.get(`http://localhost:5000/api/messages?channel=${this.state.channel}&after=${this.state.heartbeat_timestamp.toISOString()}`).then(res => {
      let new_messages = res.data.data;
      let messages = new_messages.length > 0 ? new_messages.concat(this.state.messages).slice(0, MESSAGE_LIMIT) : this.state.messages; 
      this.setState({ messages : messages, heartbeat_timestamp: new Date(), heartbeat_lock: false });
    });
  }

  handleMessageChange(event) {
    // Update our component state's version of the message input field content
    this.setState({ form_message : event.target.value });
  }

  handleMessageSubmit(event) {
    event.preventDefault();

    // Handle messages that are empty or null (we ignore those) 
    let message = this.state.form_message;
    if (message == null || message === '') {
      return;
    }

    // Here, we want to POST to the backend server, signifying that we've
    // created a new message
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
    // If we are still loading initial messages, we want to return some
    // form of a loading screen. We can tell that we are loading messages
    // because the heartbeat interval function has not been set yet.
    // The heartbeat function's purpose is to poll the server continuously
    // for new messages that have arrived between the last ping and the current ping. 
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

    // Paragraph styling: text gets a red color
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
              <input type="text" className="u-full-width" onChange={this.handleMessageChange}/><br/>
              <input type="submit" value="Submit"/>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Channel;
