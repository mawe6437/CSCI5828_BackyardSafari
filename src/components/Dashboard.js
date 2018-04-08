import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { Container, Grid } from 'semantic-ui-react'

import { LOCAL_STRAGE_KEY } from '../utils/Settings'
import { Link } from 'react-router-dom'

// API
import * as MyAPI from '../utils/MyAPI'

class Dashboard extends Component {

  logoutRequest = () => {
    console.log("logoutRequest received!")
    const { user } = this.props

    const param = {
      login_token: user.login_token
    }

    MyAPI.logout(param)
    .then((results) => {
      localStorage.removeItem(LOCAL_STRAGE_KEY);
      this.props.history.push("/")
    })
    .catch((err) => {
      console.log("err: ", err)
      localStorage.removeItem(LOCAL_STRAGE_KEY);
      this.props.history.push("/")
    })
  }

  render() {
    let title = (
      <div>
        <h1>Backyard Safari</h1>
        <h2>Welcome to Backyard Safari!</h2>
      </div>
    );

    const { user } = this.props

    return(
      <div className='dashboard' style={{textAlign: 'center'}}>
        <Container className='home' style={{textAlign: 'center'}}>
          <Grid style={{marginTop:60}}>
            <Grid.Column textAlign='center' width={16}>
              {title}
            </Grid.Column>
            <Grid.Column textAlign='left' width={16}>
              <Link to="/new_game">New Game</Link>
            </Grid.Column>
            <Grid.Column textAlign='left' width={16}>
              <Link to="/search_games">Search Games</Link>
            </Grid.Column>
            <Grid.Column textAlign='left' width={16}>
              <Link to="/upload_image">Upload an image</Link>
            </Grid.Column>
            <Grid.Column textAlign='left' width={16}>
              <span style={{cursor: 'pointer'}} onClick={() => this.logoutRequest()}>Logout</span>
            </Grid.Column>
          </Grid>
        </Container>
        <div style={{marginTop:60}}>
          <div>
            { JSON.stringify(user)}
          </div>
        </div>
      </div>
    )
  }
}

// react-redux
function mapStateToProps ( {user} ) {
  return {
    user
  }
}

// export default withRouter(MainPage);
export default withRouter( connect( mapStateToProps )(Dashboard) )
