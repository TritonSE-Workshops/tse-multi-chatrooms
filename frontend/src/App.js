import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Home from './components/home';
import Channel from './components/channel';

class App extends Component {
  render() {
    return (
      <div>
        <Route path="/" exact render={(props) => <Home {...props}/>}/>
        <Route path="/channel/:name" render={(props) => <Channel {...props}/>}/>
      </div>
    ); 
  }
}

export default App;
