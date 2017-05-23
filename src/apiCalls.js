const rootDirectory = 'https://pinballmap.com/api/v1/'

export const apiCall = (path) => {
  fetch(`${rootDirectory}${path}`)
  .then(response => response.json())
  .then(data => {
    console.log(data)
  })
  .catch(error => {
    console.log(error)
  })
}
