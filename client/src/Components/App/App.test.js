import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import fetchMock from 'fetch-mock'
import { mount, shallow } from 'enzyme'
const makeServiceWorkerEnv = require('service-worker-mock')

describe('App', () => {
  // it('renders without crashing', () => {
  //   const div = document.createElement('div')
  //   ReactDOM.render(<App />, div)
  // })

  it.skip('should render', () => {

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

})
