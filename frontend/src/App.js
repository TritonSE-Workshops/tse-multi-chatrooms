import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Home from './components/home';
import Channel from './components/channel';

class App extends Component {
  render() {
    /*
     * TODO:
     * We want to add a route for our home page! (i.e. a route with path = '/')
     * Hint: this route will take in three parameters: path, exact, render
     */
    return (
      <div>
        <Route path="/channel/:name" render={(props) => <Channel {...props}/>}/>
      </div>
    ); 
  }
}

export default App;
