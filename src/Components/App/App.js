import React, { Component } from 'react';

import { pinballApiCall, gmapsApiCall, latLonPinballApiCall } from '../../apiCalls'
import './App.css';
import { latLongConversion } from '../../helperFunctions/latLongConversion'
import {server} from '../../server'
import {LocationDisplay} from '../LocationDisplay/LocationDisplay.js'

class App extends Component {
  constructor() {
    super()
    this.state = {
      city: '',
      lat: null,
      location_types: [],
      long: null,
      machines: [],
      regions: [],
      state: '',
      nearbyPins: []
    }
  }

  componentWillMount() {
    this.fetchData()
    this.verifyGeolocation()
    let distanceApart = latLongConversion(10,100,20,200)
    this.featureDetection()
    this.askNotificationPermission()
    // this.subscribeUserToPush()
    this.alternativeCode()

  }

  fetchData() {
    const machinePath ='machines.json'
    const regionPath ='regions.json'
    const locationTypePath ='location_types.json'
    const pathArr = [machinePath, regionPath, locationTypePath]

    pathArr.forEach(path => {
      pinballApiCall(path).then(data => {
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
      this.fetchNearbyPins(lat, long)
      gmapsApiCall(lat, long)
      .then(data => {
        this.setState({ city: data.city, state: data.state })
      })
      .catch(error => {
        this.setState({ city: 'n/a', state: 'n/a' })
      })
    })
  }

  fetchNearbyPins(lat, long) {
    latLonPinballApiCall(lat, long)
    .then( nearbyPinData => {
      this.setState({nearbyPins: nearbyPinData.locations});
    })
  }

  featureDetection() {
    return !('serviceWorker' in navigator) || !('PushManager' in window) ?
    false : true
  }

  askNotificationPermission() {
    return new Promise((resolve, reject) => {
      const permissionResult = Notification.requestPermission(result => {
        resolve(result)
      })
      if(permissionResult) {
        permissionResult.then(resolve,reject)
      }
    })
    .then(permissionResult => {
      if(permissionResult !== 'granted') {
        throw new Error('We were not granted notification permission')
      }
    })
  }

  getNotificationPermissionState() {
    if(navigator.permissions) {
      return navigator.permissions.query({name: 'notifications'})
      .then(result => result.state)
    }
    return new Promise(resolve => resolve(Notification.permission))
  }

  // subscribeUserToPush() {
  //   // return getRegistration()
  //   // console.log(navigator.serviceWorker.ready)
  //   navigator.serviceWorker.ready
  //   .then(registration => {
  //     console.log(registration);
  //     const subscribeOptions = {
  //       userVisibleOnly: true,
  //       applicationServerKey: this.urlBase64ToUint8Array('BGGVP-YnOCGyLSqDenJGe7tkmqbNgyKjUlzlpCRtgU2YBvonZZWh5vgNhiyB6MoVe06L-8LW47l7zKvhFa1R-8U')
  //     }
  //     return registration.pushManager.subscribe(subscribeOptions)
  //   })
  //   .then(pushSubscription => {
  //     console.log('Received PushSubscription:  ', JSON.stringify(pushSubscription))
  //     return pushSubscription
  //   })
  // }

  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/')

    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
  }

  alternativeCode() {
    var endpoint;
    var key;
    var authSecret;
    let appKey = this.urlBase64ToUint8Array('BGGVP-YnOCGyLSqDenJGe7tkmqbNgyKjUlzlpCRtgU2YBvonZZWh5vgNhiyB6MoVe06L-8LW47l7zKvhFa1R-8U')

    navigator.serviceWorker.register('service-worker.js')
    .then(function(registration) {
      return registration.pushManager.getSubscription()
      .then(function(subscription) {
        if (subscription) {
          return subscription;
        }
        return registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey:  appKey
        });
      });
    })
    .then(function(subscription) {
      var rawKey = subscription.getKey ? subscription.getKey('p256dh') : '';
      key = rawKey ?
            btoa(String.fromCharCode.apply(null, new Uint8Array(rawKey))) :
            '';
      var rawAuthSecret = subscription.getKey ? subscription.getKey('auth') : '';
      authSecret = rawAuthSecret ?
                   btoa(String.fromCharCode.apply(null, new Uint8Array(rawAuthSecret))) :
                   '';
      endpoint = subscription.endpoint
      fetch('./register', {
        method: 'post',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          endpoint: subscription.endpoint,
          key: key,
          authSecret: authSecret,
        }),
      });
    });

    fetch('./sendNotification', {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        endpoint: endpoint,
        key: key,
        authSecret: authSecret,
        payload: 'hi there',
        delay: 1,
        ttl: 1,
      })
    })
  }


  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Please login or signup</h2>
          <img src='https://d30y9cdsu7xlg0.cloudfront.net/png/17955-200.png' />
          {/* <img src='./pinball-favicon.png' /> */}
          <h1>Show Me the Pin</h1>
          <p id='location-text'>In or Around {this.state.city}, {this.state.state}</p>
        </div>
        <LocationDisplay nearbyPins = {this.state.nearbyPins}/>
      </div>
    );
  }
}

export default App;
