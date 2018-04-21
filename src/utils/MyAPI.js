// you can change the port number at server/index.js
const api = "http://localhost:3002"
//const api = "http://ec2-18-188-26-9.us-east-2.compute.amazonaws.com:3002"
const API_KEY = '__api_key__'

const headers = {
  'Accept': 'application/json',
  'Authorization': API_KEY
}

// create an account
export const createAccount = (params) =>
  fetch(`${api}/create_user`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify( params )
  }).then(res => res.json())

// signin
export const signinWithPassword = (params) =>
  fetch(`${api}/login_with_email_password`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify( params )
  }).then(res => res.json())


// upload
export const upload = (data) =>
  fetch(`${api}/files`, {
    method: 'POST',
    body: data
  }).then(res => res.json())

// upload image
export const upload_image = (params) =>
  fetch(`${api}/upload_image`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify( params )
  }).then(res => res.json())

// upload game
export const upload_game = (params) =>
  fetch(`${api}/upload_game`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify( params )
  }).then(res => res.json())

// update game
export const update_game = (params) =>
  fetch(`${api}/update_game`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify( params )
  }).then(res => res.json())

// find all games
export const search_games = () =>
    fetch(`${api}/search_games`).then(res => res.json())

// search for specific game by description
// export const search_games_description = ( params ) =>
//     fetch(`${api}/search_games_description`).then(res => res.json())

export const search_games_description = (params) =>
      fetch(`${api}/search_games_description`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
      'Authorization': API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify( params )
      }).then(res => res.json())

// retrieve user games
export const get_mygames = (params) =>
  fetch(`${api}/get_mygames`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify( params )
  }).then(res => res.json())

// retrieve a game
export const get_game = (params) =>
  fetch(`${api}/get_game`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify( params )
  }).then(res => res.json())

// signin with token
export const signinWithToken = (params) =>
  fetch(`${api}/login_with_token`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify( params )
  }).then(res => res.json())

// logout
export const logout = (params) =>
  fetch(`${api}/logout`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify( params )
  }).then(res => res.json())
