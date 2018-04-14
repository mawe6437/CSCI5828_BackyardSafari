import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import React, {Component} from 'react';
import {bindAll} from 'lodash';

// semantic-ui
import { Container, Grid, Button, Form, Input } from 'semantic-ui-react'

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
      description: null,
      processing: false
    }

    bindAll(this, 'handleFile', 'handleSubmit');
  }

  handleFile(e) {
    const reader = new FileReader();
    const file = e.target.files[0];

    reader.onload = (upload) => {
      this.setState({
        data_uri: upload.target.result,
        filename: file.name,
        filetype: file.type
      });
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

    // Grab the userId out of local storage
    let json = JSON.parse(localStorage.getItem(LOCAL_STRAGE_KEY));
    let user = json["user"]._id;

    this.setState({
        userId: user
    });

    e.preventDefault();
    const _this = this;

    this.setState({
      processing: true
    });

    // Image Params
    // 1. Image URI
    // 2. User ID
    // 3. Upload Timestamp
    // Debug: filename
    // Debug: filetype

    // FIXME! - Pull UserID out of LOCAL_STRAGE_KEY
    const image_params = {
      data_uri: this.state.data_uri,
      user_id: this.state.userId,
      filename: this.state.filename,
      filetype: this.state.filetype,
    }

    console.log('Passing image_params to API:')
    console.log('userId')
    console.log(image_params.user_id)
    console.log('filename')
    console.log(image_params.filename)
    console.log('filetype')
    console.log(image_params.filetype)
    // Upload picture
    MyAPI.upload_image(image_params)
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
          console.log('API: upload image promise success!')
          // success
          _this.setState({
            processing: false,
            uploaded_uri: data.uri,
            uploaded_imageId: data.imageId
          });

           // Game parameters
           // 1. Master Image ID
           // 2. Master User ID
           // 3. Challenger Image ID (NULL)
           // 4. Challenger User ID (NULL)
           // 5. Description
           // 6. Status - Open, Pending, Closed
 
           // FIXME! - Pull UserID out of LOCAL_STRAGE_KEY
           const game_params = {
             m_imageId: this.state.uploaded_imageId,
             m_userId: this.state.userId,
             c_imageId: null,
             c_userId: null,
             description: this.state.description,
             g_status: "Open"
           }
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
                  // success
                  console.log('API: upload game promise success!')
                  _this.setState({
                    gameId: data.gameId,
                    gameStatus: data.g_status
                  });

                }
              })
            })
            .then(() => {
              console.log('upload: redirect here')
              // redirect
        //      this.props.history.push("/dashboard")
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
        <h4>Step 1: Write Description</h4>
        <h4>Step 2: Upload image</h4>
        <h4>Step 3: Hit Create Button</h4>
      </div>
    );

    let processing;
    let uploaded;

    console.log('Image Upload Rendering!');

    if (this.state.uploaded_uri) {
      uploaded = (
        <div>
          <h4>Image uploaded!</h4>
          <h4>UserID: {this.state.userId}</h4>
          <h4>Description: {this.state.description}</h4>
          <h4>GameID: {this.state.gameId}</h4>
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
        <form onSubmit={this.handleSubmit} encType="multipart/form-data">
          <Grid>
            <Grid.Column textAlign='center' width={16}>
              {title}
            </Grid.Column>
            <Grid.Column textAlign='left' width={16}>
              <label>Description</label>
              <Input
                style={{width: '100%'}}
                name='description'
                onChange={this.handleChange}
                value={description}
                placeholder='Add description here' />
            </Grid.Column>
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
              <input disabled={this.state.processing} className='btn btn-primary' type="submit" value="Create" />
               {processing}
              {uploaded}
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
export default withRouter( connect( mapStateToProps)(ImageUpload) )
