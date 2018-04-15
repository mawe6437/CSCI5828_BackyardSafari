import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { Container, Grid, Form, Button } from 'semantic-ui-react'

import { LOCAL_STRAGE_KEY } from '../utils/Settings'
import { Link } from 'react-router-dom'

// API
import * as MyAPI from '../utils/MyAPI'

class MyGames extends Component {

 goHome = (e) => {
    this.props.history.push("/dashboard")
  }

  render() {
    // Grab the userId out of local storage
    let json = JSON.parse(localStorage.getItem(LOCAL_STRAGE_KEY));
    let userid = json["user"]._id;

    const mygame_params = {
        user_id: userid
    }

    MyAPI.get_mygames(mygame_params)
      .then((data) =>
    {
      console.log('Games retrieved. Data:');
      console.log(data);
      let results = data.results;
      console.log('results:');
      console.log(results);
      var i;

      let container = document.getElementById("gamesContainer");
      function createGames(item, index) {
        container.innerHTML = container.innerHTML + "<h4> Game ID: " + item + "</h4><br/>";
      }

      for (i = 0; i < results.length; i++) {
        console.log('Image %s', i);
        let id = results[i]._id;
        console.log(id);
        createGames(id, i)
      }

    });

    let title = (
      <div>
        <h1>Backyard Safari</h1>
        <h2>My Games</h2>
      </div>
    );

    const { user } = this.props

//        container.innerHTML = container.innerHTML + "<img src=\"" + baseUrl + item + "\"/><br/>";
//              <img className='image-preview' src={this.state.data_uri} alt="Uploaded Title" />
    return(
      <div className='mygames' style={{textAlign: 'center'}}>
        <Container className='mygames' style={{textAlign: 'center'}}>
          <Grid style={{marginTop:60}}>
            <Grid.Column textAlign='center' width={16}>
              {title}
            </Grid.Column>
            <Grid.Column textAlign='left' width={16}>
              <div id="gamesContainer"></div>
            </Grid.Column>
          </Grid>
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
export default withRouter( connect( mapStateToProps )(MyGames) )
