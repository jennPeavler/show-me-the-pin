const rootDirectory = 'https://pinballmap.com/api/v1/'

export const apiCall = (path) => {
  return fetch(`${rootDirectory}${path}`)
  .then(response => response.json())
  .then(data => {
    return data
  })
  .catch(error => {
    console.log(error)
  })
}

//Correct syntax for the lat_lon api call
//https://pinballmap.com/api/v1/locations/closest_by_lat_lon.json?lat=39.662900799999996&lon=-104.8459333999999
