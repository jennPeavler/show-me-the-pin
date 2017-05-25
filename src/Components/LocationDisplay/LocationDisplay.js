import React from 'react'

export const LocationDisplay = ({ nearbyPins }) => {
  return (
    <div>
      {nearbyPins.map( location => {
        return (
          <p key={location.name}>{location.name}</p>
        )
      })}
    </div>
  )
}
