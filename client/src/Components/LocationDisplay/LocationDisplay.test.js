import React from 'react';
import { LocationDisplay } from './LocationDisplay';
import { mount, shallow } from 'enzyme'
import nearbyPins from '../../mockData/nearbyPins'


describe('LocationDisplay', () => {
  it('should render', () => {
    const wrapper = shallow(<LocationDisplay nearbyPins={nearbyPins.locations} searched={[]} />)

    expect(wrapper.length).toEqual(1)
  })

  it('should not render any locations if the user search does not find anything', () => {
    const wrapper = shallow(<LocationDisplay
                    nearbyPins={nearbyPins.locations}
                    searched={['something is in here']}
                    searchInput={true} />)
    const locations = wrapper.find('.location-name')

    expect(locations.length).toEqual(1)
  })

  it('should render all nearbyPins if the user has not searched', () => {
    const wrapper = shallow(<LocationDisplay
                    nearbyPins={nearbyPins.locations}
                    searched={[]}
                    searchInput={false}/>)
    const locations = wrapper.find('.location-name')

    expect(locations.length).toEqual(nearbyPins.locations.length)
  })

  it('should render the correct number of locations that are returned from a search', () => {
    const wrapper = shallow(<LocationDisplay
                    nearbyPins={nearbyPins.locations}
                    searched={[{name: 1}, {name: 2}, {name: 3}]}
                    searchInput={true}/>)
    const locations = wrapper.find('.location-name')

    expect(locations.length).toEqual(3)
  })
})
