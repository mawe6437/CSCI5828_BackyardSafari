import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import React, {Component} from 'react';
import {bindAll} from 'lodash';

// semantic-ui
import { Container, Grid, Button, Form } from 'semantic-ui-react'

// alert
//import Alert from 'react-s-alert';

// API
import * as MyAPI from '../utils/MyAPI'
import { LOCAL_STRAGE_KEY } from '../utils/Settings'
import { LOCAL_GAME_KEY } from '../utils/Settings'

class ViewGame extends Component {

  constructor() {
   super();
    this.state = {
      data_uri: null,
      processing: false
    }

    bindAll(this, 'handleSubmit');
  }

  componentDidMount() {
    const game_data = localStorage.getItem(LOCAL_GAME_KEY)
    if (!game_data) {
      console.log('ViewGame: No Game Data!!');
      // Redirect to dashboard here
      return;
    }

    const game_json = JSON.parse(game_data)
    if ( game_json && game_json.gameId ) {
      this.getGameData(game_json.gameId)
    }
  }

  getGameData = (gameId) => {
    // login with token

    const param = {
      gameId: gameId
    }

    const _this = this;

    MyAPI.get_game(param)
    .then((data) => {

      return new Promise((resolve, reject) => {

        if (data.status !== 'success'){
          reject('error')
        } else {
          console.log('MyAPI.get_game returned result:');
          console.log(data);
          // success
          _this.setState({
            gameId: data.results._id,
            gameStatus: data.results.g_status,
            gameDescription: data.results.description,
            c_image: data.results.c_image,
            c_userId: data.results.c_userId,
            m_image: data.results.m_image,
            m_userId: data.results.m_userId
          });

          //FIXME! - Retrieve images here
          resolve()
        }
      })
    })
    .catch((err) => {
      console.log("err:", err)
      localStorage.removeItem(LOCAL_STRAGE_KEY);
    })
  }

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value })
  }

  goHome = (e) => {
    //FIXME! - Clear Game local storage here
    this.props.history.push("/dashboard")
  }


  handleSubmit(e)
  {

  }

  render() {

    let title = (
      <div>
        <h1>Backyard Safari</h1>
        <h2>View Game</h2>
      </div>
    );

    let loaded;

    if (this.state.gameId){
         loaded = (
        <div>
          <h4>Game data loaded!</h4>
          <h4>GameID: {this.state.gameId}</h4>
          <h4>Description: {this.state.gameDescription}</h4>
          <h4>Game Status: {this.state.gameStatus}</h4>
          <h4>Master UserID: {this.state.m_userId}</h4>
          <h4>Master ImageId:</h4>
          <img className='image-preview' src={this.state.m_image} alt="No Image Found" />
          <h4>Challenge UserID: {this.state.c_userId}</h4>
          <h4>Challenge ImageId:</h4>
          <img className='image-preview' src={this.state.c_image} alt="No Image Found" />
        </div>
      );
    }

    return(
     <Container text className='view_game_form'>
        <form onSubmit={this.handleSubmit} encType="multipart/form-data">
          <Grid>
            <Grid.Column textAlign='center' width={16}>
              {title}
            </Grid.Column>
            <Grid.Column textAlign='left' width={16}>
              {loaded}
            </Grid.Column>
          </Grid>
        </form>
        <Form onSubmit={this.goHome} style={{marginTop:60}}>
        <Grid>
           <Grid.Column  textAlign='center' width={4}>
              <Button
                style={{width: '100%'}}
                type='submit'>Home</Button>
            </Grid.Column>
          </Grid>
        </Form>
      </Container>
    );
  }
}
// react-redux
function mapStateToProps ( {user} ) {
  return {
    user
  }
}

// export default withRouter(MainPage);
export default withRouter( connect( mapStateToProps)(ViewGame) )
