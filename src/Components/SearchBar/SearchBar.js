import React, { Component } from 'react'

export default class LocatorButton extends Component {
  constructor({ handleClick }) {
    super()
    this.state = {

    }
  }

  render() {
    return (
      <input placeholder='Search' id='search-bar' />
    )
  }
}
