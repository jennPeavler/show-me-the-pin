import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import {LocationDisplay} from '../LocationDisplay/LocationDisplay'

export const NavBar = () => {
  return (
    <Router>
      <section id='nav-bar'>
        <Link to='/'>
          <button className='nav-btns' id='list-btn'>
            List View
          </button>
        </Link>
        <Link to='/map'>
          <button className='nav-btns' id='map-btn'>
            Map View
          </button>
        </Link>
      </section>
    </Router>
  )
}
