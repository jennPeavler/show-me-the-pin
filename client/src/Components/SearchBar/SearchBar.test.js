import React from 'react';
import { SearchBar } from './SearchBar';
import { mount, shallow } from 'enzyme'

describe('LocationDisplay', () => {
  it('should render', () => {
    const search = jest.fn()
    const wrapper = mount(<SearchBar search={search} />)

    expect(wrapper.length).toEqual(1)
  })

  it('should call the search function when user types in the search field', () => {
    const search = jest.fn()
    const wrapper = mount(<SearchBar search={search} />)
    const searchBar = wrapper.find('#search-bar')

    searchBar.simulate('change', {target: {value: 'hi'}})
    expect(search).toHaveBeenCalledTimes(1)
  })
})
