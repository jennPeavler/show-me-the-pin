import React from 'react';
import { Map } from './Map';
import { mount, shallow } from 'enzyme'
import nearbyPins from '../../mockData/nearbyPins'

describe('Map', () => {
  it('should render', () => {
    const wrapper = shallow(<Map nearbyPins={nearbyPins.locations}
                                 searchecd={[]}
                                 mapElement={<div className='mapelement' />}
                                 containerElement={<div className='containerElement' />}
                            />)

    expect(wrapper.length).toEqual(1)
  })

  it('should have no markers if user search returns no matches', () => {
    const wrapper = shallow(<Map nearbyPins={nearbyPins.locations}
                                 searched={[]}
                                 mapElement={<div className='mapelement' />}
                                 containerElement={<div className='containerElement' />}
                                 searchInput={true}
                            />)
    const markers = wrapper.find('Marker')
    expect(markers.length).toEqual(0)
  })

  it('should have markers for all nearbyPins if the user has not searched', () => {
    const wrapper = shallow(<Map nearbyPins={nearbyPins.locations}
                                 searched={[]}
                                 mapElement={<div className='mapelement' />}
                                 containerElement={<div className='containerElement' />}
                                 searchInput={false}
                            />)
    const markers = wrapper.find('Marker')
    expect(markers.length).toEqual(nearbyPins.location.length)
  })

})
