import {latLongConversion} from './latLongConversion';

describe('lat long conversion function', () => {
  it('should calculate the distance between two points given two sets of latitude and longitude', () => {
    expect(latLongConversion(10, 100, 20, 200)).toEqual(10666.00632727324)
  })
})
