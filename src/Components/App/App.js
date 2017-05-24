import React, { Component } from 'react';

import { apiCall } from '../../apiCalls'
import './App.css';
import { latLongConversion } from '../../helperFunctions/latLongConversion'

class App extends Component {
  constructor() {
    super()
    this.state = {}
  }

  componentWillMount() {
    this.fetchData()
    this.verifyGeolocation()
    let distanceApart = latLongConversion(10,100,20,200)
    console.log(distanceApart);
    this.featureDetection()
    this.askNotificationPermission()

  }

  fetchData() {
    const machinePath ='machines.json'
    const regionPath ='regions.json'
    const locationTypePath ='location_types.json'
    const pathArr = [machinePath, regionPath, locationTypePath]

    pathArr.forEach(path => {
      apiCall(path).then(data => {
        let key = Object.keys(data)
        this.setState({ [key]: data[key]})
      })
    })
  }

  verifyGeolocation() {
    return 'geolocation' in navigator ? this.getLocation() : false
  }

  getLocation() {
    navigator.geolocation.getCurrentPosition(position => {
      let lat = position.coords.latitude
      let long = position.coords.longitude
      this.setState({ lat, long })
    })
  }

  featureDetection() {
    return !('serviceWorker' in navigator) || !('PushManager' in window) ?
    false : true
  }

  askNotificationPermission() {
    console.log('in permission');
    return new Promise((resolve, reject) => {
      const permissionResult = Notification.requestPermission(result => {
        resolve(result)
      })
      if(permissionResult) {
        permissionResult.then(resolve,reject)
      }
    })
    .then(permissionResult => {
      console.log('we got permission');
      if(permissionResult !== 'granted') {
        throw new Error('We were not granted notification permission')
      }
    })
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
