import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import fetchMock from 'fetch-mock'
import { mount, shallow } from 'enzyme'
const makeServiceWorkerEnv = require('service-worker-mock')
process.env.NODE_ENV = 'test';

describe('App', () => {

  it('should render', () => {

    window.Notification = {
      requestPermission: () => Promise.resolve('granted')
    }

    window.navigator.serviceWorker = {
      serviceWorker: {
        register: () => Promise.resolve({
          scope: 'http://localhost:3000/',
          active: 'serviceWorker'})
      }
    }

    window.navigator.serviceWorker.register = () => Promise.resolve({
      scope: 'http://localhost:3000/',
      active: 'serviceWorker'})

    window.registration = {
      pushManager: {
        subscribe: () => Promise.resolve({
          endpoint: 'https://fcm.googleapis.com/fcm/send/eXjVTIGKcRw:AP…GBkZ0_o1WfAJ-HM7YmKGbeOcmhh1um6UAt94Cb6naK547yYX8'
          })
      }
    }

    window.registration.pushManager = {
      subscribe: () => Promise.resolve({
        endpoint: 'https://fcm.googleapis.com/fcm/send/eXjVTIGKcRw:AP…GBkZ0_o1WfAJ-HM7YmKGbeOcmhh1um6UAt94Cb6naK547yYX8'
        })
    }

    window.registration.pushManager.subscribe = () => Promise.resolve({
      endpoint: 'https://fcm.googleapis.com/fcm/send/eXjVTIGKcRw:AP…GBkZ0_o1WfAJ-HM7YmKGbeOcmhh1um6UAt94Cb6naK547yYX8'
    })

    Object.assign(global, makeServiceWorkerEnv())
      require('../../service-worker.js')

    const wrapper = shallow(<App />)
    expect(wrapper.length).toEqual(1)
  })

  it.skip('should find the users location', () => {
    // const wrapper = shallow(<App />)
    // console.log(wrapper.state());
    window.navigator.geolocation = {
      getCurrentPosition: () => {
          return {coords: {latitude: 10, longitude: 100}}
      }
        // return {coords: {latitude: 10, longitude: 100}}

    }
    const app = new App()

    app.getLocation()
    expect(app.state.lat).toBe(10)
    expect(app.state.long).toBe(100)
  })


  it.skip('should verify that geolocation is in the browser', () {

  })

  it.skip('should verify that serviceWorker is in navigator and PushManager is in window', () => {

  })

  it.skip('should ask for permission before sending notifications', () => {

  })

  it.skip('should send notifications to backend', () => {

  })

  it.skip('should fetchPinballApiData', () => {

  })

  it.skip('should find pinball machines near users location', () {

  })

  it.skip('should send a notification if user is within 500 ft of a location', () {

  })

})
