import React from 'react'

export const SearchBar = ({ search }) => {
  return (
    <input id='search-bar'
           placeholder='Search'
           onChange = {event => {search(event.target.value)} }
    />
  )
}
