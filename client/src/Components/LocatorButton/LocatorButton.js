import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

export default class LocatorButton extends Component {
  constructor({ handleClick }) {
    super()
    this.state = {

    }
  }

  render() {
    return (
      <button id='pop-bumper-button'>
        <div id='star-five'></div>
        <div id='star-five2'></div>
        <div id='star-five3'></div>
        <div id='inner-oval'>Find Your Inner<br></br> Pinball Wizard</div>
      </button>
    )
  }
}

  // <NavLink className="nav-link" activeClassName='selected' to={'/'}> Home </NavLink>
