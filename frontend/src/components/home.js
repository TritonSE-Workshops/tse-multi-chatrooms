import React, { Component } from 'react';
import axios from 'axios';

class Home extends Component {
  constructor(props) {
    super(props);

    // Set up initial state
    this.state = {
      name: localStorage.getItem('name'), // Name is pulled from the JS local storage 
      channels: [],
      form_name: '',
      form_channel: ''
    };
    
    // Add bindings for changing the channel field
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleNameSubmit = this.handleNameSubmit.bind(this);

    // Add bindings for changing the channel form
    this.handleChannelChange = this.handleChannelChange.bind(this);
    this.handleChannelSubmit = this.handleChannelSubmit.bind(this);
  }

  componentDidMount() {
    // When the component mounts, we want to fetch the top 5 channels and
    // then add them to our state, setting the channels array 
    axios.get("http://localhost:5000/api/channels?limit=5").then(res => {
      let channels = res.data.data;
      this.setState({channels : channels});
    });
  }

  handleNameChange(event) {
    // We want to update our state's version of the name input field  
    this.setState({ form_name : event.target.value });
  }

  handleNameSubmit(event) {
    /*
     * TODO: 
     *
     * We want to do four things here.
     *
     * 1) Clear the form with the id "name-form".
     * 2) Set our name in the JS Local Storage to be this.state.form_name
     * 3) Set this.state.name to be this.state.form_name
     * 4) Prevent the event from triggering a GET submission
     */
  }

  handleChannelChange(event) {
    // We want to update our state's version of the channel input field  
    this.setState({ form_channel : event.target.value });
  }

  handleChannelSubmit(event) {
    // Clear the channel input box
    document.getElementById("channel-form").reset();

    // Navigate to /channel/{STORED_CHANNEL}
    this.props.history.push("/channel/" + this.state.form_channel);

    // Prevent the event from triggering an actual submission
    event.preventDefault();
  }

  render() {
    return (
      <div className="container separation-large">
        <div className="row separation">
          <div className="twelve columns">
            <h2>TSE Multi-User Chatrooms</h2>
            <p>This is a barebones implementation of a chatting application brought to you by Triton Software Engineering. Much like Slack or IRC, users pick an identifier (their name) and then can go to a channel to chat. All messages are persisted across each channel.</p>
          </div>  
        </div>
        <div className="row separation">
          <div className="six columns">
            <h3>Change Your Name</h3>
            <p>{this.state.name != null ? "Your name is currently " + this.state.name + ", but you can always change it below." :  "You will need to enter your name and then click on a channel."}</p>
            <form onSubmit={this.handleNameSubmit} id="name-form">
              <label>Name: </label>
              <input type="text" className="u-full-width" onChange={this.handleNameChange}/><br/>
              <input type="submit" value="Submit"/>
            </form>
          </div>  
          <div className="six columns">
            <h3>Join a Channel</h3>
            <p>Here are some popular channels.</p>
            <ul>
              {this.state.channels.map(channel =>
                <li key={channel.name}><a href={"/channel/" + channel.name}>{channel.name}</a> <sub>{channel.message_count} message(s)</sub></li>
              )}
            </ul>
            <p>None of these channels appeal to you? You can always enter in a channel by name.</p>
            <form onSubmit={this.handleChannelSubmit} id="channel-form">
              <label>Channel: </label>
              <input type="text" className="u-full-width" onChange={this.handleChannelChange}/><br/>
              <input type="submit" value="Submit"/>
            </form>
          </div>  
        </div>
      </div>
    );
  }
}

export default Home;
