import React from 'react'
import { Link } from 'react-router-dom'

export const LocationDisplay = ({ nearbyPins, searched, searchInput, match, city, state, history, unclickAllMapPins }) => {
  const saySomething = () => {
    return console.log('something')
  }
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
            <Link className='location-name' key={location.id} to={`/${location.id}`}>
              <p key={location.name}>{location.name}</p>
            </Link>
          )
        })}
      </div>
    )
  }
  else {
    return (
      <div id='locations-container'>
        {saySomething}
        {searched.map( location => {
          return (
            <Link className='location-name' key={location.id} to={`/${location.id}`}>
              <p key={location.name}>{location.name}</p>
            </Link>
          )
        })}
      </div>
    )
  }
}
