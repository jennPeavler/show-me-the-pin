import React from 'react'
import { Link } from 'react-router-dom'

export const NavBar = () => {
  return (

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

  )
}
