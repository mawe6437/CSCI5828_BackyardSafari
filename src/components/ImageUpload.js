//import { withRouter } from 'react-router'
//import { connect } from 'react-redux'
import React, {Component} from 'react';
import {bindAll} from 'lodash';

// semantic-ui
import { Container, Grid } from 'semantic-ui-react'

// alert
import Alert from 'react-s-alert';

// API
import * as MyAPI from '../utils/MyAPI'
//import { LOCAL_STRAGE_KEY } from '../utils/Settings'

class ImageUpload extends Component {

  constructor() {
   super();
    this.state = {
      data_uri: null,
      processing: false
    }

    bindAll(this, 'handleFile', 'handleSubmit');
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

        var MAX_WIDTH = 500;
        var MAX_HEIGHT = 500;
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

  handleSubmit(e)
  {
    console.log('handleSubmit enter');

    e.preventDefault();
    const _this = this;

    this.setState({
      processing: true
    });

    const params = {
      data_uri: this.state.data_uri,
      filename: this.state.filename,
      filetype: this.state.filetype
    }

    console.log('Passing params to API:')
    console.log('data uri')
    console.log(params.data_uri)
    console.log('filename')
    console.log(params.filename)
    console.log('filetype')
    console.log(params.filetype)
    // Upload picture
    MyAPI.upload_image(params)
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
            uploaded_uri: data.uri
      });
        }
      })
    })
    .then(() => {
      console.log('upload: redirect here')
      // redirect
      this.props.history.push("/dashboard")
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
    let processing;
    let uploaded;

    console.log('Image Upload Rendering!');

    if (this.state.uploaded_uri) {
      uploaded = (
        <div>
          <h4>Image uploaded!</h4>
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
              <label>Upload an image</label>
          <Grid>
            <Grid.Column textAlign='left' width={16}>
              <div className='row'>
              <div className='col-sm-12'>
              <input type="file" onChange={this.handleFile} />
             </div>
             </div>
            </Grid.Column>
          </Grid>
          <Grid>
            <Grid.Column textAlign='left' width={16}>
              <input disabled={this.state.processing} className='btn btn-primary' type="submit" value="Upload" />
               {processing}
              {uploaded}
            </Grid.Column>
          </Grid>
        </form>
      </Container>
    );
  }
}

export default ImageUpload;
