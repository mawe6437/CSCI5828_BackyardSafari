import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import React, {Component} from 'react';
import {bindAll} from 'lodash';

// semantic-ui
import { Container, Grid, Button, Form } from 'semantic-ui-react'

// alert
import Alert from 'react-s-alert';

// API
import * as MyAPI from '../utils/MyAPI'
import { LOCAL_STRAGE_KEY } from '../utils/Settings'
import { LOCAL_GAME_KEY } from '../utils/Settings'

class ViewGame extends Component {

  constructor() {
   super();
    this.state = {
      data_uri: null,
    }

    bindAll(this, 'handleFile', 'handleSubmit');
  }

  componentDidMount() {

    // Grab the userId out of local storage
    let json = JSON.parse(localStorage.getItem(LOCAL_STRAGE_KEY));
    console.log(json);
    let userid = json["user"]._id;
    this.setState({ cur_user: userid});

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
            m_userId: data.results.m_userId,
            g_score: data.results.g_score,
            g_end_time: data.results.g_end_time,
            g_start_time: data.results.g_start_time,
            g_time_start_display: data.results.g_time_start_display,
            g_end_time_display: data.results.g_end_time_display
          });
          console.log("now start time:", this.state.g_start_time);
          console.log("now end time:", this.state.g_end_time);
          console.log("now score:", this.state.g_score);

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
    localStorage.removeItem(LOCAL_GAME_KEY);
    this.props.history.push("/dashboard")
  }

  // Master has accepted Challenger image
  onAccept = (e) => {
    console.log('Challenge image accepted!')

    let time = new Date();

    let g_end_time_display = "";
    let hours = time.getHours()
    let minutes = time.getMinutes()
    let seconds = time.getSeconds()

    if (minutes < 10) {
      minutes = "0" + minutes
        }

        if (seconds < 10) {
          seconds = "0" + seconds
        }

        g_end_time_display += hours + ":" + minutes + ":" + seconds + " ";

        if(hours > 11){
          g_end_time_display += "PM"
        } else {
          g_end_time_display += "AM"
        }
        console.log("time after", g_end_time_display);


    let g_end_time = new Date().getTime();
    let score =  (1000 / ((g_end_time - this.state.g_start_time) / 3600)).toFixed(3);
    console.log("score:", score);
    console.log("end time:", this.state.g_start_time);
    console.log("end time:", g_end_time);

    e.preventDefault();
    const update_params = {
       game_id: this.state.gameId,
       c_image: this.state.c_image,
       c_userId: this.state.c_userId,
       m_image: this.state.m_image,
       m_userId: this.state.m_userId,
       description: this.state.gameDescription,
       g_status : 'finished',
       g_end_time : g_end_time,
       g_end_time_display : g_end_time_display,
       g_score : score
    }

    MyAPI.update_game(update_params)
    .then((data) => {
      return new Promise((resolve, reject) => {
       if (data.status !== 'success'){
          reject('error')
       }
       else {
          // FIXME! - Add log entry here
          // FIXME! - Update points system here
          Alert.success('CHALLENGE ACCEPTED', {
          position: 'top-right',
          onClose: function () {
            console.log('onClose Fired!');
          }
          });
          console.log('Game Updated!')
          localStorage.removeItem(LOCAL_GAME_KEY);
          this.props.history.push("/get_mygames")
        }
        });
    })
    .catch((err) => {
      console.log("err:", err)
      localStorage.removeItem(LOCAL_GAME_KEY);
    })

  }

  // Master has rejected Challenger image
  onReject = (e) => {
    console.log('Challenge image rejected!')
    e.preventDefault();
    const update_params = {
       game_id: this.state.gameId,
       c_image: null,
       c_userId: null,
       m_image: this.state.m_image,
       m_userId: this.state.m_userId,
       description: this.state.gameDescription,
       g_status : this.state.gameStatus
    }

    MyAPI.update_game(update_params)
    .then((data) => {
      return new Promise((resolve, reject) => {
       if (data.status !== 'success'){
          reject('error')
       }
       else {
          // FIXME! - Add log entry here
          Alert.success('CHALLENGE REJECTED', {
          position: 'top-right',
          onClose: function () {
            console.log('onClose Fired!');
          }
          });
          console.log('Game (reject) Updated!')
          localStorage.removeItem(LOCAL_GAME_KEY);
          this.props.history.push("/get_mygames")

          //resolve()
        }
        });
    })
    .catch((err) => {
      console.log("err:", err)
      localStorage.removeItem(LOCAL_GAME_KEY);
    })
 }

  // Master has deleted this game
  onDelete = (e) => {

   e.preventDefault();
   const param = {
      gameId: this.state.gameId
    }

    console.log('Deleting gameId:')
    console.log(this.state.gameId)
    MyAPI.delete_game(param)
    .then((data) => {

     return new Promise((resolve, reject) => {
       if (data.status !== 'success'){
          reject('error')
       }
       else {
          // FIXME! - Add log entry here
          console.log('Game deleted!')
         Alert.success('GAME DELETED', {
          position: 'top-right',
          onClose: function () {
            console.log('onClose Fired!');
          }
          });

          localStorage.removeItem(LOCAL_GAME_KEY);
          this.props.history.push("/get_mygames")
        }
        });
    })
    .catch((err) => {
      console.log("err:", err)
      localStorage.removeItem(LOCAL_GAME_KEY);
    })
 }

  // Challenger has removed his image
  onRemove = (e) => {
    console.log('Challenger Removed!')
    e.preventDefault();
    const update_params = {
       game_id: this.state.gameId,
       c_image: null,
       c_userId: null,
       m_image: this.state.m_image,
       m_userId: this.state.m_userId,
       description: this.state.gameDescription,
       g_status : this.state.gameStatus
    }

    MyAPI.update_game(update_params)
    .then((data) => {
      return new Promise((resolve, reject) => {
       if (data.status !== 'success'){
          reject('error')
       }
       else {
          // FIXME! - Add log entry here
          Alert.success('CHALLENGE REMOVED', {
          position: 'top-right',
          onClose: function () {
            console.log('onClose Fired!');
          }
          });
          console.log('Game (remove) Updated!')
          localStorage.removeItem(LOCAL_GAME_KEY);
          this.props.history.push("/dashboard")
        }
        });
    })
    .catch((err) => {
      console.log("err:", err)
      localStorage.removeItem(LOCAL_GAME_KEY);
    })
 }

handleDeadSubmit(e)
  {
  }

handleSubmit(e)
  {
    console.log('in handleSubmit')

    e.preventDefault();
    const _this = this;

    // Game parameters
    // 1. Game ID
    // 2. Challenger Image
    // 3. Challenger User ID

    const update_params = {
       game_id: this.state.gameId,
       c_image: this.state.data_uri,
       c_userId: this.state.cur_user,
       m_image: this.state.m_image,
       m_userId: this.state.m_userId,
       description: this.state.gameDescription,
       g_status : this.state.gameStatus
    }

    console.log('Passing game_params to API:')
    console.log('userId')
    console.log(update_params.c_userId)
    console.log('gameId')
    console.log(update_params.game_id)
    // Update game
    MyAPI.update_game(update_params)
    .then((data) =>
    {
      return new Promise((resolve, reject) =>
      {
        if (data.status !== 'success')
        {
          let error_text = 'Error';
          if (data.detail)
          {
            error_text = data.detail
          }
          reject(error_text)

        }
        else
        {
          console.log('API: upload game promise success!')
          Alert.success('CHALLENGE SUBMITTED', {
          position: 'top-right',
          onClose: function () {
            console.log('onClose Fired!');
          }
          });
          // success
          _this.setState({
            c_image: this.state.data_uri,
            c_userId: this.state.cur_user
          });
        }
      })
    })
    .catch((err) => {
      console.log("err:", err)

      Alert.error(err, {
        position: 'top-right',
        effect: 'slide',
        timeout: 5000
      });
   })
  }

  handleFile(e) {
    const reader = new FileReader();
    const file = e.target.files[0];

    //resize image before upload
    reader.onload = (upload) => {
      var img = document.createElement("img");
      img.onload = () => {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        var MAX_WIDTH = 400;
        var MAX_HEIGHT = 400;
        var width = img.width;
        var height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      var dataurl = canvas.toDataURL("image/png");
      this.setState({
        data_uri: dataurl,
        filename: file.name,
        filetype: file.type
      });
    }
    img.src = upload.target.result;
    };

    reader.readAsDataURL(file);
  }


  render() {

    let title = (
      <div>
        <h1>Backyard Safari</h1>
        <h2>View Game</h2>
      </div>
    );

    let loaded;
    let master;
    let challenge;
    let complete;

    if (this.state.gameId){
         loaded = (
        <div>
          <h4>Game data loaded!</h4>
          <h4>GameID: {this.state.gameId}</h4>
          <h4>Description: {this.state.gameDescription}</h4>
          <h4>Game Status: {this.state.gameStatus}</h4>
          <h4>Master UserID: {this.state.m_userId}</h4>
          <h4>Master Image:</h4>
          <img className='image-preview' src={this.state.m_image} alt="No Image Found" />
          <h4>Challenge UserID: {this.state.c_userId}</h4>
          <h4>Challenge Image:</h4>
          <img className='image-preview' src={this.state.c_image} alt="No Image Found" />
        </div>
      );
    }

   // Logged in as Master
   if (this.state.gameStatus === 'open'){
     console.log('Game is open!')

     // Master View
     if (this.state.cur_user === this.state.m_userId){
       console.log('You are master of this game')
       // If challenge image and open status, Accept/Reject buttons
       if (this.state.c_image != null){
         master = (
           <div>
             <Button id="Accept" value="Accept" onClick={this.onAccept}>Accept</Button>
             <Button id="Reject" value="Reject" onClick={this.onReject}>Reject</Button>
           </div>
         );
       }
       // If no challenge image, add Delete button
       else{
         master = (
           <div>
             <Button id="Delete" value="Delete" onClick={this.onDelete}>Delete</Button>
           </div>
         );

       }

     }
     // Challenger View
     else{
       console.log('You are challenger of this game')
       // Add Challenge Image
       if (this.state.c_image === null){
         //Upload image here
         challenge = (
           <form onSubmit={this.handleSubmit} encType="multipart/form-data">
              <Grid>
                <Grid.Column textAlign='left' width={16}>
                  <label>Upload an image</label>
                  <div className='row'>
                  <div className='col-sm-12'>
                  <input type="file" onChange={this.handleFile} />
                  </div>
                  </div>
                </Grid.Column>
              </Grid>
            <Grid>
              <Grid.Column textAlign='left' width={16}>
                <input className='btn btn-primary' type="submit" value="Upload" />
              </Grid.Column>
            </Grid>
          </form>
        );
       }
       else{
         challenge = (
           <div>
             <Button id="Remove" value="Remove" onClick={this.onRemove}>Remove</Button>
           </div>
         );
      }
    }
   }
   else{
   // Game is not open; either deleted or finished
  complete = (
    <div>
    <h4>Start Time:{this.state.g_time_start_display}</h4>
    <h4>End Time:{this.state.g_end_time_display}</h4>
    <h4>Score:{this.state.g_score}</h4>
    </div>

  )
   }

    return(
     <Container text className='view_game_form'>
        <form onSubmit={this.handleDeadSubmit} encType="multipart/form-data">
          <Grid>
            <Grid.Column textAlign='center' width={16}>
              {title}
            </Grid.Column>
            <Grid.Column textAlign='left' width={16}>
              {loaded}
              {master}
              {challenge}
              {complete}
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
