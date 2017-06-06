import React from 'react'
import ReactDOM from 'react-dom'
import App from './Components/App/App'
import './index.css'
import { BrowserRouter as Router } from 'react-router-dom'
import createHistory from 'history/createBrowserHistory'

const history = createHistory()

ReactDOM.render(<Router history={history}><App /></Router>, document.getElementById('root'))
