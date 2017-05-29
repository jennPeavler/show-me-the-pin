import React from 'react'
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps'

export const Map = withGoogleMap(({ userLocation, nearbyPins }) => {

  const pinLocations = nearbyPins.map((location, i) => {
    return <Marker key={i}
                   position={{ lat: Number(location.lat), lng: Number(location.lon) }} />
  })

  return !userLocation.lat&&nearbyPins.length ? <div>Loading...</div> :
    <GoogleMap
      defaultZoom={12}
      defaultCenter={{ lat: userLocation.lat , lng: userLocation.long }}>
        <Marker position={{ lat: userLocation.lat, lng: userLocation.long }}
                icon={'http://web-marketing-formula.com/wp-content/plugins/sociable/images/bluedot.png'}/>
        {pinLocations}
    </GoogleMap>
})

// import React, { Component } from 'react'
// import ReactDOM from 'react-dom'
//
// export class Map extends Component {
//   componentDidUpdate(prevProps, prevState) {
//     if(prevProps.google !== this.props.google) {
//       this.loadMap()
//     }
//   }
//
//   componentDidMount() {
//     this.loadMap()
//   }
//
//   loadMap() {
//     if(this.props && this.props.google) {
//       const {google} = this.props
//       const maps = google.maps
//       const mapRef = this.refs.mapRef
//       const node = ReactDOM.findDOMNOde(mapRef)
//
//       let zoom = 14;
//       let lat = 39;
//       let long = -105
//       const center = new maps.LatLng(lat, long)
//       const mapConfig = Object.assign({}, {
//         center: center,
//         zoom: zoom
//       })
//       this.map = new maps.Map(node, mapConfig)
//     }
//   }
//
//   render () {
//     return (
//       <div ref='map'>
//         Loading map...
//       </div>
//     )
//   }
// }
