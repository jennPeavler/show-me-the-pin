import React from 'react'

export const LocationCard = ({ match, nearbyPins, history }) => {
  return (
    <div id='location-card-display'>
      {nearbyPins.map(location => {
        if(location.id === Number(match.params.id)) {
          return (
            <div className='location-card' key={location.id}>
              <h2 className='location-header'>{location.name}</h2>
              <div>
                <h3>Machines:</h3>
                {location.machine_names.map((machine ,index) => {
                  return <p className='machine-names' key={index}>{machine}</p>
                })}
              </div>
            </div>
          )
        }
      })}
    </div>
  )
}
