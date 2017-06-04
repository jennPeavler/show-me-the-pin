import React from 'react';
import { LocationCard } from './LocationCard';
import { mount, shallow } from 'enzyme'
import nearbyPins from '../../mockData/nearbyPins'


describe('LocationCard', () => {
  it('should render', () => {
    const wrapper = shallow(<LocationCard match={{}} nearbyPins={[]} />)

    expect(wrapper.length).toEqual(1)
  })

  it('should display the location that user clicked', () => {
    const wrapper = shallow(<LocationCard match={{params: {id: 2004}}} nearbyPins={nearbyPins.locations} />)

    const locationName = wrapper.find('.location-header')
    expect(locationName.node.props.children).toBe('Challengers Sport Bar & Restaurant')
  })

  it('should display the location that user clicked, test2', () => {
    const wrapper = shallow(<LocationCard match={{params: {id: 5156}}} nearbyPins={nearbyPins.locations} />)

    const locationName = wrapper.find('.location-header')
    expect(locationName.node.props.children).toBe('Nickel-A-Play')
  })

  it('should display pinball machines that are at the location that the user clicked', () => {
    const wrapper = shallow(<LocationCard match={{params: {id: 5156}}} nearbyPins={nearbyPins.locations} />)

    const pinballMachines = wrapper.find('.machine-names')
    expect(pinballMachines.length).not.toBe(0)
  })
})
