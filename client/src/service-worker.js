self.addEventListener('install', (event) => {
  let cache1 = 'site-cache'
  let urlsToCache = [
    '/',
    '/src/index.js',
    '/src/index.css'
  ]

  event.waitUntil(
    caches.open(cache1)
    .then(cache => {
      console.log('Opened cache')
      return cache.addAll(urlsToCache)
    })
  )
})

self.addEventListener('fetch', event => {
  console.log("im in the service worker file")
  event.respondWith(
    caches.match(event.request)
    .then(response => {
      if(response) {return response}
      return fetch(event.request)
    })
  )
})

self.addEventListener('push', event => {
  console.log(event);
  event.data ? console.log('this push event has data') : console.log('push has no data')

  event.waitUntil(self.registration.showNotification('In Service workier'))

})
