import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { Container, Grid, Form, Button } from 'semantic-ui-react'

import { LOCAL_STRAGE_KEY } from '../utils/Settings'
import { Link } from 'react-router-dom'
import {bindAll} from 'lodash';
// API
import * as MyAPI from '../utils/MyAPI'

import title_img from './pics/title.png'
import welcome from './pics/welcome.png'

class Dashboard extends Component {
  constructor() {
   super();

    bindAll(this, 'goNewGame', 'logoutRequest');
  }

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

  goNewGame = (e) => {
    this.props.history.push("/create_game")
  }

  goMyGame = (e) => {
    this.props.history.push("/get_mygames")
  }

  goSearchGame = (e) => {
    this.props.history.push("/search_games")
  }

  goViewLog = (e) => {
    this.props.history.push("/viewlog")
  }

  render() {
    let title = (
      <div>
        <p><img className='title_image' src={title_img}/></p>
        <img className='img_title' src={welcome} width='450' height='40'/>
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
              <Form onSubmit={this.goNewGame} style={{marginTop:20}}>
                <Button
                  style={{width: '100%'}}
                  type='submit'>New Game</Button>
              </Form>
            </Grid.Column>
            <Grid.Column textAlign='left' width={16}>
              <Form onSubmit={this.goMyGame} style={{marginTop:50}}>
                <Button
                  style={{width: '100%'}}
                  type='submit'>My Games</Button>
              </Form>
            </Grid.Column>
            <Grid.Column textAlign='left' width={16}>
              <Form onSubmit={this.goSearchGame} style={{marginTop:50}}>
                <Button
                  style={{width: '100%'}}
                  type='submit'>Search Games</Button>
              </Form>
            </Grid.Column>
            <Grid.Column textAlign='left' width={16}>
              <Form onSubmit={this.goViewLog} style={{marginTop:50}}>
                <Button
                  style={{width: '100%'}}
                  type='submit'>View Log</Button>
              </Form>
            </Grid.Column>
            <Grid.Column textAlign='left' width={16}>
              <Form onSubmit={this.logoutRequest} style={{marginTop:50}}>
                <Button
                  style={{width: '100%'}}
                  type='submit'>Logout</Button>
              </Form>
            </Grid.Column>
          </Grid>
        </Container>
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
