import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import React, {Component} from 'react';
import {bindAll} from 'lodash';

// semantic-ui
import { Container, Grid, Button, Form, Input } from 'semantic-ui-react'

// alert
//import Alert from 'react-s-alert';

// API
import * as MyAPI from '../utils/MyAPI'
//import { LOCAL_STRAGE_KEY } from '../utils/Settings'

class ImageUpload extends Component {


  constructor() {
   super();
    this.state = {
      description: null,
      games: []
    }
      bindAll(this, 'handleSubmit');
  }

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value })
  }

  goHome = (e) => {
    this.props.history.push("/dashboard")
  }

  componentDidMount() {
    MyAPI.search_games().then(data => {
      this.setState({ games: data })
    })
  }

  handleSubmit(e)
  {

    e.preventDefault();
//    const _this = this;

    // this.setState({
    //   processing: true
    // });

    console.log('Passing search to API:')
    console.log(e)

    console.log(this.state.description)
    const search_params = {
      description: this.state.description
    }

    MyAPI.search_games_description(search_params)
    .then((data) => {
    this.setState({ games: data })
    console.log("this is the data:", data)
  })
}


  render() {

     const { description } = this.state
    let title = (
      <div>
        <h1>Backyard Safari</h1>
        <h2>Find a Game</h2>
      </div>
    );

    let listOfGames = this.state.games.map(game =>
      <li className="game-list" key={game._id}>{game.description}</li>
    );

    return(
     <Container text className='search_games_form'>
        <form onSubmit={this.handleSubmit} encType="multipart/form-data">
          <Grid>
            <Grid.Column textAlign='center' width={16}>
              {title}
            </Grid.Column>
          </Grid>
          <Grid>
            <Grid.Column textAlign='center' width={16}>

             </Grid.Column>
             <Grid.Column textAlign='left' width={16}>
               <label>Search for a game by desctiption:</label>
               <Input
                 style={{width: '100%'}}
                 name='description'
                 onChange={this.handleChange}
                 value={description}
                 placeholder='Game description' />
                 </Grid.Column>
                 <Grid.Column textAlign='left' width={16}>
                   <input disabled={this.state.processing} className='btn btn-primary' type="submit" value="Search" />

                 </Grid.Column>
                 <br/>
                 <Grid.Column textAlign='left' width={16}>
                 <label>Games:</label>
             <ul>
              {listOfGames}
             </ul>
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

//export default withRouter(MainPage);
export default withRouter( connect( mapStateToProps)(ImageUpload) )
