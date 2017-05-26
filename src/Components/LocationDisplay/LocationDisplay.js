import React from 'react'

export const LocationDisplay = ({ nearbyPins, searched }) => {
  if(!searched.length) {
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
