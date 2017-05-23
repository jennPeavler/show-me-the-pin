
// given lat/long in degs of two points, calculates the distance in kilometers between them
export const latLongConversion = (lat1, long1, lat2, long2) => {
  const R = 6378.137
  const deg = Math.PI/180
  let deltaLat = deg * (lat2 - lat1)
  let deltaLong = deg * (long2 - long1)
  
  const sinDeltaVal = (deltaVal) => {
    return Math.sin(deltaVal/2)
  }

  const cosLatVal = (latVal) => {
    return Math.cos(latVal * deg)
  }

  const a = () => {
    return Math.pow(sinDeltaVal(deltaLat), 2) + cosLatVal(lat1)*cosLatVal(lat2) *
      Math.pow(sinDeltaVal(deltaLong), 2)
  }

  let c = 2 * Math.atan2(Math.sqrt(a()), Math.sqrt(1-a()))
  return c * R
}
