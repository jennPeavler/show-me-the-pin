import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom'
// const webPush = require('web-push')
import { pinballApiCall, gmapsApiCall, latLonPinballApiCall } from '../../helpers_apiCalls/apiCalls'
import { latLongConversion } from '../../helpers_apiCalls/latLongConversion'
import { Map } from '../Map/Map'
import { LocationDisplay } from '../LocationDisplay/LocationDisplay'
import { LocationCard } from '../LocationCard/LocationCard'
import { PopBumper} from '../PopBumper/PopBumper'
import { InspirationalQuote } from '../InspirationalQuote/InspirationalQuote'
import { SearchBar } from '../SearchBar/SearchBar'
import { NavBar } from '../NavBar/NavBar'

import './App.css';

export default class App extends Component {
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
      searchInput: false,
      clickedMarker: false
    }
  }

  componentWillMount() {
    this.verifyGeolocation()
    latLongConversion(10,100,20,200)
    this.featureDetection()
    this.askNotificationPermission()
    this.sendSubscriptionToBackEnd()
  }

  findPinWithinRange() {

  }

  componentDidMount() {
    this.fetchPinballApiData()
  }

  fetchPinballApiData() {
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
      // console.log(nearbyPinData);
      const pinsInOrder = nearbyPinData.locations.sort((a,z) => {
        return a.name.toUpperCase() < z.name.toUpperCase() ? -1 : 1
      })
      pinsInOrder.forEach(pin => {
        pin.clicked = false
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
      console.log(registration);
      return registration.pushManager.subscribe(subscribeOptions);
    })
    .then(pushSubscription => {
      return pushSubscription
    })
  }

  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')

    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
  }

  sendSubscriptionToBackEnd() {
    this.subscribeUserToPush()
    .then(pushSubscription => {
      console.log(pushSubscription);
      let subscription = JSON.stringify(pushSubscription)
      return fetch('api/save-subscription', {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: subscription
      })
      .then(response => {
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

  search(searchInput) {
    searchInput ? this.setState({searchInput: true}) : this.setState({searchInput: false})
    let searchResults = searchInput ?
      this.state.nearbyPins.filter(location => location.name.toUpperCase()
      .includes(searchInput.toUpperCase()))
      : this.state.nearbyPins

      this.setState({ searched: searchResults })
  }

  fetchSubscriptions() {
    fetch('http://localhost:3001/api/save-subscription')
  }

  handleClick() {
    console.log('clicking a location');
  }

  handleMarkerClick(location) {
    let newState = []

    this.state.nearbyPins.forEach(pin => {
      if(pin.name===location.name) {
        pin.clicked = !pin.clicked
      }
      newState.push(pin)
    })
    this.setState({nearbyPins: newState})
  }

  render() {
    const locationDisplay = () => {
      return (
        <LocationDisplay city={this.state.city}
          state={this.state.state}
          nearbyPins={this.state.nearbyPins}
          searched={this.state.searched}
          searchInput={this.state.searchInput}
          handleClick={this.handleClick.bind(this)}/>
      )
    }

    const map = () => {
      return(
        <section>
          <Map mapElement={ <div className='mapelement' /> }
               containerElement={ <div className='containerElement' /> }
               userLocation={{lat: this.state.lat, long: this.state.long}}
               nearbyPins={this.state.nearbyPins}
               searched={this.state.searched}
               searchInput={this.state.searchInput}
               handleMarkerClick={this.handleMarkerClick.bind(this)} />
        </section>
      )
    }

    const location = ({ match }) => {
        return (
          <section>
            <LocationCard match={match} nearbyPins={this.state.nearbyPins} />
          </section>
        )
    }

    return (
      <section className="App">
        <header>Pin<span id='show'>show</span></header>
        <div id='divider'></div>
        <main>
          <PopBumper id='pop-bumper' />
          <InspirationalQuote id='quote' />
          <h2 id='intro-message'>Finding pinball locations near you....</h2>
          <section id='controls-wrapper'>
            <SearchBar search={this.search.bind(this)}/>
            <NavBar />
          </section>

            <Switch>
              <Route path='/map' component={map} />
              <Route exact path='/' component={locationDisplay} />
              <Route path='/:id' component={location} />
            </Switch>

        </main>
      </section>
    )
  }
}
