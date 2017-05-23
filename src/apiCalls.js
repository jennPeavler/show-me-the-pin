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
