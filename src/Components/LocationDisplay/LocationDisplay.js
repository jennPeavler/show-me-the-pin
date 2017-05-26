import React from 'react'

export const LocationDisplay = ({ nearbyPins, searched, searchInput }) => {
  if(!searched.length && searchInput === true){
    return (
      <div id='locations-container'>
        <p className='location-name'>No Locations Found</p>
      </div>
    )
  }
  else if(!searched.length) {
    return (
      <div id='locations-container'>
        {nearbyPins.map( location => {
          return (
            <p className='location-name' key={location.name}>{location.name}</p>
          )
        })}
      </div>
    )
  }
  else {
    return (
      <div id='locations-container'>
        {searched.map( location => {
          return (
            <p className='location-name' key={location.name}>{location.name}</p>
          )
        })}
      </div>
    )
  }
}
