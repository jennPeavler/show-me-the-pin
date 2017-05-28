import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom'

import { pinballApiCall, gmapsApiCall, latLonPinballApiCall } from '../../apiCalls'
import { latLongConversion } from '../../helperFunctions/latLongConversion'
import {Map} from '../Map/Map'
import {LocationDisplay} from '../LocationDisplay/LocationDisplay'
import LocatorButton from '../LocatorButton/LocatorButton'
import {InspirationalQuote} from '../InspirationalQuote/InspirationalQuote'
import {SearchBar} from '../SearchBar/SearchBar'
import {NavBar} from '../NavBar/NavBar'
import './App.css';

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
      nearbyPins: [],
      searched: [],
      searchInput: false
    }
  }

  componentWillMount() {
    this.fetchData()
    this.verifyGeolocation()
    let distanceApart = latLongConversion(10,100,20,200)
    this.featureDetection()
    this.askNotificationPermission()
    this.sendSubscriptionToBackEnd()
    // this.alternativeCode()

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
      const pinsInOrder = nearbyPinData.locations.sort((a,z) => {
        return a.name.toUpperCase() < z.name.toUpperCase() ? -1 : 1
      })
      this.setState({nearbyPins: pinsInOrder})
    })
  }

  featureDetection() {
    return !('serviceWorker' in navigator) || !('PushManager' in window) ?
    false : true
  }

  registerServiceWorker() {
    return navigator.serviceWorker.register('service-worker.js')
    .then(function(registration) {
      return registration;
    })
    .catch(function(err) {
      console.error('Unable to register service worker.', err)
    })
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

  subscribeUserToPush() {
    return this.registerServiceWorker()
    .then(registration => {
      const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          'BGGVP-YnOCGyLSqDenJGe7tkmqbNgyKjUlzlpCRtgU2YBvonZZWh5vgNhiyB6MoVe06L-8LW47l7zKvhFa1R-8U'
        )
      }
      return registration.pushManager.subscribe(subscribeOptions);
    })
    .then(pushSubscription => {
      console.log('Received PushSubscription: ', JSON.stringify(pushSubscription));
      return pushSubscription
    })
  }

  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/')

    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
  }

  sendSubscriptionToBackEnd() {
    this.subscribeUserToPush()
    .then(pushSubscription => {
      console.log(pushSubscription);
      let subscription = JSON.stringify(pushSubscription)
      console.log(subscription);
      return fetch('register', {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: subscription
      })
      .then(response => {
        console.log(response);
        if(!response.ok) {
          throw new Error('Bad status code from server.')
        }
        return response.json()
      })
      .then(responseData => {
        console.log(responseData);
        if(!(responseData.data && responseData.data.success)) {
          throw new Error('Bad response from server')
        }
      })
    })
  }
  // alternativeCode() {
  //   var endpoint;
  //   var key;
  //   var authSecret;
  //   let appKey = this.urlBase64ToUint8Array('BGGVP-YnOCGyLSqDenJGe7tkmqbNgyKjUlzlpCRtgU2YBvonZZWh5vgNhiyB6MoVe06L-8LW47l7zKvhFa1R-8U')
  //
  //   navigator.serviceWorker.register('service-worker.js')
  //   .then(function(registration) {
  //     // console.log(registration);
  //     return registration.pushManager.getSubscription()
  //     .then(function(subscription) {
  //       // console.log(subscription);
  //       if (subscription) {
  //         return subscription;
  //       }
  //       return registration.pushManager.subscribe({
  //         userVisibleOnly: true,
  //         applicationServerKey:  appKey
  //       });
  //     });
  //   })
  //   .then(function(subscription) {
  //     console.log(subscription);
  //     var rawKey = subscription.getKey ? subscription.getKey('p256dh') : '';
  //     key = rawKey ?
  //           btoa(String.fromCharCode.apply(null, new Uint8Array(rawKey))) :
  //           '';
  //     var rawAuthSecret = subscription.getKey ? subscription.getKey('auth') : '';
  //     authSecret = rawAuthSecret ?
  //                  btoa(String.fromCharCode.apply(null, new Uint8Array(rawAuthSecret))) :
  //                  '';
  //     endpoint = subscription.endpoint
  //     fetch('register', {
  //       method: "POST",
  //       headers: {
  //         "Content-type": "application/json"
  //       },
  //       body: JSON.stringify({
  //         endpoint: subscription.endpoint,
  //         key: key,
  //         authSecret: authSecret
  //       })
  //     })
  //     fetch('sendNotification', {
  //       method: 'post',
  //       headers: {
  //         'Content-type': 'application/json'
  //       },
  //       body: JSON.stringify({
  //         endpoint: subscription.endpoint,
  //         key: key,
  //         authSecret: authSecret,
  //         payload: 'hi there',
  //         delay: 1,
  //         ttl: 1
  //       })
  //     })
  //   })
  // }

  handleClick() {
    console.log('i am clicked')
  }

  scrollQuote() {
    console.log('scrolling')
  }

  search(searchInput) {
    searchInput ? this.setState({searchInput: true}) : this.setState({searchInput: false})
    let searchResults = searchInput ?
      this.state.nearbyPins.filter(location => location.name.toUpperCase()
      .includes(searchInput.toUpperCase()))
      : this.state.nearbyPins

      this.setState({ searched: searchResults })
  }

  render() {
    const locationDisplay = () => {
      return (
        <LocationDisplay city={this.state.city}
          state={this.state.state}
          nearbyPins={this.state.nearbyPins}
          searched={this.state.searched}
          searchInput={this.state.searchInput}/>
      )
    }
    const map = () => {
      return(
        <section>
          <p>Map will go here!!!!!!!!!!🌈</p>
          <Map mapElement={ <div className='mapelement' style={{ height: "300px"}}/> }
               containerElement={ <div className='containerElement' style={{ height: "300px"}}/> }
               userLocation={{lat: this.state.lat, long: this.state.long}}
               nearbyPins={this.state.nearbyPins}/>
        </section>
      )
    }

    return (
      <section className="App">
        <header>Pin<span id='show'>show</span></header>
        <div id='divider'></div>
        <main>
          <LocatorButton id='locator' handleClick={this.handleClick.bind(this)}/>
          <InspirationalQuote id='quote' scrollQuote={this.state.quote} />
          <h2 id='intro-message'>Finding pinball locations near you....</h2>
          <section id='controls-wrapper'>
            <SearchBar search={this.search.bind(this)}/>
            <NavBar />
          </section>
          <Router>
            <Switch>
              <Route path='/map' component={map} />
              <Route exact path='/' component={locationDisplay} />
            </Switch>
          </Router>
        </main>
      </section>
    )
  }
}


export default App;
