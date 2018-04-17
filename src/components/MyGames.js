import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { Container, Grid, Form, Button} from 'semantic-ui-react'

import { LOCAL_STRAGE_KEY, LOCAL_GAME_KEY } from '../utils/Settings'
//import { Link } from 'react-router-dom'
import {bindAll} from 'lodash';
// API
import * as MyAPI from '../utils/MyAPI'

class MyGames extends Component {

  constructor() {
   super();
    this.state = {
      game: null,
      retrieved: false,
      gameArray:[]
    }

    bindAll(this, 'goHome', 'onClick', 'componentDidMount');
  }

 goHome = (e) => {
    this.setState({
      retrieved: false
    });
    this.props.history.push("/dashboard")
  }

 onClick = (e) => {
    const input = e.target.id
    console.log(e.target);
    console.log(input);
    console.log('onClick ID is', input);
    const params = {
      gameId : input,
    }
    localStorage.setItem(LOCAL_GAME_KEY, JSON.stringify(params));
    console.log("LOCAL_GAME_KEY:", localStorage.getItem(LOCAL_GAME_KEY))
    this.props.history.push("/viewgame")
 }

 componentDidMount() {
    // Grab the userId out of local storage
    let json = JSON.parse(localStorage.getItem(LOCAL_STRAGE_KEY));
    console.log(json);
    let userid = json["user"]._id;

    const _this = this;
    const mygame_params = {
          user_id: userid
    }
    MyAPI.get_mygames(mygame_params)
        .then((data) =>
    {
      let tempArray = [];
      console.log('Games retrieved. Data:')
      console.log(data);
      let results = data.results;
      console.log('results:');
      console.log(results);
      var i;

      tempArray.push(
       <div>
        <h2>Games List:</h2>
       </div>
      );

      for (i = 0; i < results.length; i++) {
        console.log('Image %s', i);
        let id = results[i]._id;
        console.log(id);

        tempArray.push(
         <div>
          <h4>GameID: {id}</h4>
          <button id={id} value={id} onClick={this.onClick}>View</button>
        </div>
        );
      }
      console.log('Results added to state:')
      console.log(tempArray)
      _this.setState({ gameArray:tempArray})
    });
 }

 render() {
   console.log('Enter render here!')

    let title = (
      <div>
        <h1>Backyard Safari</h1>
        <h2>My Games</h2>
      </div>
    );

    console.log('this.state.gameArray is now:');
    console.log(this.state.gameArray);
    return(
      <div className='mygames' style={{textAlign: 'center'}}>
        <Container className='mygames' style={{textAlign: 'center'}}>
          <Grid style={{marginTop:60}}>
            <Grid.Column textAlign='center' width={16}>
              {title}
            </Grid.Column>
            <Grid.Column textAlign='left' width={16}>
              {this.state.gameArray}
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
