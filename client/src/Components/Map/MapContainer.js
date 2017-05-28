import React, { Component } from 'react'
// import {Map} from './Map'
import Map from 'google-maps-react'

import { GoogleApiWrapper } from 'google-maps-react'

export class MapContainer extends Component {
  
  render() {
    const style = {
      width: '300px',
      height: '300px'
    }
    console.log(this.props);
    if(!this.props.loaded) {
      return <div>Loading...</div>
    }
    return(
      <div style={style}>
        <Map google={this.props.google} />
      </div>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBP4Sqzyrw9b7QLaxpO-q8wg2KRSXEu5FY'
})(MapContainer)
