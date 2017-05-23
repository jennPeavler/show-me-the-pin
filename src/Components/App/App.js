import React, { Component } from 'react';

import { apiCall } from '../../apiCalls'
import './App.css';

class App extends Component {
  constructor() {
    super()
    this.state = {
      machines: [],
      regions: [],
      locationType: []
    }
  }

  componentWillMount() {
    const machinePath ='machines.json'
    const regionPath ='regions.json'
    const locationTypePath ='location_types.json'

    apiCall(machinePath)
    apiCall(regionPath)
    apiCall(locationTypePath)
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Show Me the Pin</h2>
        </div>
        <p className="App-intro">
        </p>
      </div>
    );
  }
}

export default App;
