'use strict'

require('babel-polyfill')
require('fetch-polyfill')

require('offline-plugin/runtime').install()

const AppState = require('./appstate.js')
const React = require('react')
const ReactDOM = require('react-dom')
const SchSrch = require('./schsrch.jsx')

window.requestIdleCallback = window.requestIdleCallback || (func => setTimeout(func, 1000))
window.cancelIdleCallback = window.cancelIdleCallback || (id => clearTimeout(id))

let setHashTimeout = null
let hashIdle = null

function readFromLocalStorage () {
  try {
    let stateData = window.localStorage.getItem('state')
    let parse = JSON.parse(stateData)
    if (typeof parse === 'object') {
      return parse
    } else {
      return false
    }
  } catch (e) {
    return false
  }
}

if (history.state) {
  AppState.dispatch({type: 'load', state: history.state})
} else {
  AppState.dispatch({type: 'init'})
  let queryMatch
  if ((queryMatch = window.location.toString().match(/\/formsearch\/\?query=([^&=]+)$/))) {
    let q = decodeURIComponent(queryMatch[1].replace(/\+/g, ' '))
    AppState.dispatch({type: 'query', query: q})
  } else if ((queryMatch = window.location.toString().match(/\/disclaim\/$/))) {
    AppState.dispatch({type: 'disclaim'})
  } else {
    let nsState = readFromLocalStorage()
    nsState && AppState.dispatch({type: 'load', state: nsState})
  }
}

window.AppState = AppState

AppState.subscribe(() => {
  if (hashIdle) {
    cancelIdleCallback(hashIdle)
    hashIdle = null
  }
  requestIdleCallback(() => {
    let nState = AppState.getState()
    let url = '/'
    if (nState.view !== 'home') {
      url = '/' + encodeURIComponent(nState.view) + '/'
    }
    else if (nState.previewing) {
      url = '/formsearch/?query=' + encodeURIComponent(nState.previewing.psKey)
    } else if (nState.query.length > 0) {
      url = '/formsearch/?query=' + encodeURIComponent(nState.query)
    }
    history.replaceState(nState, 'SchSrch', url)
    window.localStorage.setItem('state', JSON.stringify(nState))
  })
})

window.addEventListener('popstate', evt => {
  let state = evt.state
  AppState.dispatch({type: 'load', state})
})

let ui = ReactDOM.render(
  <SchSrch />,
  document.getElementsByClassName('react-root')[0]
)

window.addEventListener('resize', evt => {
  setTimeout(() => ui.forceUpdate(), 1)
})