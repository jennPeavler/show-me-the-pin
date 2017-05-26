import React from 'react'

export const LocationDisplay = ({ nearbyPins }) => {
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
