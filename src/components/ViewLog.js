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
import title_img from './pics/title.png'
import viewlog from './pics/viewlog.png'

class ViewLog extends Component {

  constructor() {
   super();
    this.state = {
      data_uri: null,
    }

  }

  componentDidMount() {

    // Grab the userId out of local storage
    let json = JSON.parse(localStorage.getItem(LOCAL_STRAGE_KEY));
    console.log(json);
    let userid = json["user"]._id;
    this.setState({ cur_user: userid});

    this.getLogData(userid)
  }

  getLogData = (userid) => {
    // login with token

    const param = {
      user_id: userid
    }

    const _this = this;

    MyAPI.get_mylog(param)
    .then((data) => {

      return new Promise((resolve, reject) => {

        if (data.status !== 'success'){
          reject('error')
        } else {
          let i;
          let tempArray = [];
          let results = data.results;
          console.log('MyAPI.get_myLog returned result:');
          console.log(data);

          for (i = 0; i < results.length; i++) {
            let id = results[i]._id;
            let log_entry = results[i].log_entry;
            let log_time = results[i].log_time;
            console.log(log_entry);

           tempArray.push(
            <div>
             <h4><hr></hr></h4>
             <h4><font color="white">{log_time}: {log_entry}</font></h4>
           </div>
           )
          }

          // success
          _this.setState({
            m_loaded: 'True',
            logArray: tempArray
          });

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

handleDeadSubmit(e)
  {
  }

  render() {

    let title = (
      <div>
        <p><img className='title_image' src={title_img}/></p>
        <img className='img_title' src={viewlog} width='170' height='30'/>
      </div>
    );

    let loaded;

    if (this.state.loaded){
         loaded = (
        <div>
          <h4>User log data loaded!</h4>
        </div>
      );
    }

    return(
     <Container text className='view_log_form'>
        <form onSubmit={this.handleDeadSubmit} encType="multipart/form-data">
          <Grid>
            <Grid.Column textAlign='center' width={16}>
              {title}
            </Grid.Column>
            <Grid.Column textAlign='left' width={16}>
              {loaded}
            </Grid.Column>
            <Grid.Column textAlign='left' width={16}>
              {this.state.logArray}
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
export default withRouter( connect( mapStateToProps)(ViewLog) )
