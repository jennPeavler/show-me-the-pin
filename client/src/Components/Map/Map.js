import React from 'react'
import { withGoogleMap, GoogleMap, Marker, InfoWindow } from 'react-google-maps'

export const Map = withGoogleMap(({ userLocation, nearbyPins, searched, searchInput, handleMarkerClick, history }) => {

  const pinLocations = nearbyPins.map((location, i) => {
    if(!searched.length && searchInput === true) {
      return
    }
    else if(searchInput === false) {
      return <Marker className='location-marker' key={i}
              position={{ lat: Number(location.lat), lng: Number(location.lon) }}
              onClick={()=>handleMarkerClick(location)}>
              { location.clicked === true && (
                <InfoWindow onCloseClick={()=>handleMarkerClick(location)}><p>{location.name}</p></InfoWindow>
              )}
             </Marker>
    }
  })

  const searchedLocations = searched.map((location, i) => {
    if(searched.length && searchInput === true) {
      return <Marker key={i}
        position={{ lat: Number(location.lat), lng: Number(location.lon) }}
        onClick={()=>handleMarkerClick(location)}>
        { location.clicked === true && (
          <InfoWindow onCloseClick={()=>handleMarkerClick(location)}><p>{location.name}</p></InfoWindow>
        )}
        </Marker>
    }
  })


  return !userLocation.lat&&nearbyPins.length ? <div>Loading...</div> :
    <GoogleMap
      defaultZoom={10}
      defaultCenter={{ lat: userLocation.lat , lng: userLocation.long }}>
        <Marker position={{ lat: userLocation.lat, lng: userLocation.long }}
                icon={'http://web-marketing-formula.com/wp-content/plugins/sociable/images/bluedot.png'}/>
        {pinLocations}
        {searchedLocations}
    </GoogleMap>
})
