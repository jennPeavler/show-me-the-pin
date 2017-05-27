const pinballRootDirectory = 'https://pinballmap.com/api/v1/'
const gmapsApiRootDirectory = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='
const gmapsKey = 'AIzaSyCUaXesP0EVFquDILv3y-rnO77gWWL7fR8'

export const pinballApiCall = (path) => {
  return fetch(`${pinballRootDirectory}${path}`)
  .then(response => response.json())
  .then(data => {
    return data
  })
  .catch(error => {
    return null
  })
}

export const gmapsApiCall = (lat, long) => {
  return fetch(`${gmapsApiRootDirectory}${lat},${long}&key=${gmapsKey}`)
  .then(response => response.json())
  .then(data => {
    let city = data.results[0].address_components[3].long_name
    let state = data.results[0].address_components[5].short_name
    return {city, state}
  })
  .catch(error => {
    return null
  })
}

export const latLonPinballApiCall = (lat, long) => {
  return fetch(`https://pinballmap.com/api/v1/locations/closest_by_lat_lon.json?lat=${lat}&lon=${long}&send_all_within_distance=5`)
  .then(response => response.json())
  .then(data => {
    return data
  })
  .catch(error => {
    return null
  })
}

//Correct syntax for the lat_lon api call
//https://pinballmap.com/api/v1/locations/closest_by_lat_lon.json?lat=39.662900799999996&lon=-104.8459333999999
