import React, { Component } from 'react';
import './App.css';
import Contest from 'containers/Contest'


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  render() {
    return (
      <div className="App">
        <Contest />
      </div>
    );
  }
}

export default App;
