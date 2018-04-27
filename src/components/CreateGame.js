import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import React, {Component} from 'react';
import {bindAll} from 'lodash';

// semantic-ui
import { Container, Grid, Button, Form, Input, Label } from 'semantic-ui-react'

// alert
import Alert from 'react-s-alert';

// API
import * as MyAPI from '../utils/MyAPI'
import { LOCAL_STRAGE_KEY } from '../utils/Settings'

class ImageUpload extends Component {

  constructor() {
   super();
    this.state = {
      data_uri: null,
      description: "",
      processing: false
    }

    bindAll(this, 'handleFile', 'handleSubmit');
  }

  handleFile(e) {
    const reader = new FileReader();
    const file = e.target.files[0];

    //resize image before upload
    reader.onload = (upload) => {
      console.log('handleFile: onload')
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

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value })
  }

  goHome = (e) => {
    this.props.history.push("/dashboard")
  }


  handleSubmit(e)
  {
    console.log('in handleSubmit')

    e.preventDefault();
    const _this = this;

    this.setState({
      processing: true
    });

    // Grab the userId out of local storage
    let json = JSON.parse(localStorage.getItem(LOCAL_STRAGE_KEY));
    let user = json["user"]._id;


    // Game parameters
    // 1. Master Image
    // 2. Master User ID
    // 3. Challenger Image (NULL)
    // 4. Challenger User ID (NULL)
    // 5. Description
    // 6. Status - Open, Pending, Closed

    const game_params = {
       m_image: this.state.data_uri,
       m_userId: user,
       c_image: null,
       c_userId: null,
       description: this.state.description,
       g_status: "open"
    }

    console.log('Passing game_params to API:')
    console.log('userId')
    console.log(game_params.user_id)
    console.log('description')
    console.log(game_params.description)
    // Upload game
    MyAPI.upload_game(game_params)
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
          Alert.success('GAME CREATED', {
          position: 'top-right',
          onClose: function () {
            console.log('onClose Fired!');
          }
          });

          // success

          let entry = "Game " + data.gameId + " Created!"
          // FIXME! - Add timestamp
          const log_param = {
            m_userId: user,
            log_entry: entry
          }

          MyAPI.upload_log(log_param)

          _this.setState({
            processing: false,
            uploaded_uri: data.uri,
            gameId: data.gameId,
            gameStatus: data.g_status,
            userId: user
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

  render() {

    const { description } = this.state
    let title = (
      <div>
        <h1>Backyard Safari</h1>
        <h2>New Game Creation</h2>
      </div>
    );

    let processing;
    let uploaded;

    console.log('Image Upload Rendering!');

    if (this.state.uploaded_uri) {
      uploaded = (
        <div>
          <h4>Image uploaded!</h4>
          <h4>GameID: {this.state.gameId}</h4>
          <h4>UserID: {this.state.userId}</h4>
          <h4>Description: {this.state.description}</h4>
          <h4>Game Status: {this.state.gameStatus}</h4>
          <img className='image-preview' src={this.state.data_uri} alt="Uploaded Title" />
        </div>
      );
    }

    if (this.state.processing) {
      processing = "Processing image, hang tight";
    }

    return(
     <Container text className='image_upload_form'>
        <Form onSubmit={this.handleSubmit} encType="multipart/form-data">
          <Grid>
            <Grid.Column textAlign='center' width={16}>
              {title}
            </Grid.Column>
            <Grid.Column textAlign='left' width={16}>
              <Label pointing='below'>Select An Image</Label>
              <div className='row'>
              <div className='col-sm-12'>
              <Input type="file" onChange={this.handleFile} />
             </div>
             </div>
            </Grid.Column>
            <Grid.Column textAlign='left' width={16}>
              <Label pointing='below'>Write A Description</Label>
              <Input
                style={{width: '100%'}}
                name='description'
                onChange={this.handleChange}
                value={description}
                placeholder='Add description here' />
            </Grid.Column>
          </Grid>
          <Grid>
            <Grid.Column textAlign='left' width={16}>
              <Input size='large' disabled={this.state.processing} type="submit" value="Create Game" />
               {processing}
              {uploaded}
            </Grid.Column>
          </Grid>
        </Form>
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
export default withRouter( connect( mapStateToProps)(ImageUpload) )
