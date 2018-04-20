import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import React, {Component} from 'react';
import {bindAll} from 'lodash';

import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

// semantic-ui
import { Container, Grid, Button, Form, Input } from 'semantic-ui-react'

// alert
//import Alert from 'react-s-alert';

// API
import * as MyAPI from '../utils/MyAPI'
import { LOCAL_STRAGE_KEY, LOCAL_GAME_KEY } from '../utils/Settings'

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

  componentDidMount() {
    MyAPI.search_games().then(data => {
      this.setState({ games: data })
    })
  }

  goHome = (e) => {
     this.setState({
       retrieved: false
     });
     this.props.history.push("/dashboard")
   }

  // onClick = (e) => {
  //    const input = e.target.id
  //    console.log(e.target);
  //    console.log(input);
  //    console.log('onClick ID is', input);
  //    const params = {
  //      gameId : input,
  //    }
  //    localStorage.setItem(LOCAL_GAME_KEY, JSON.stringify(params));
  //    console.log("LOCAL_GAME_KEY:", localStorage.getItem(LOCAL_GAME_KEY))
  //    this.props.history.push("/viewgame")
  // }

  // componentDidMount() {
  //    // Grab the userId out of local storage
  //    // let json = JSON.parse(localStorage.getItem(LOCAL_STRAGE_KEY));
  //    // console.log(json);
  //    // let userid = json["user"]._id;
  //    //
  //    // const _this = this;
  //    // const mygame_params = {
  //    //       user_id: userid
  //    // }
  //
  //    MyAPI.search_games()
  //    .then((results) => {
  //
  //      let tempArray = [];
  //      console.log('Games retrieved. Data:')
  //      console.log(results);
  //      //let results = data.results;
  //      console.log('results:');
  //      console.log(results);
  //      var i;
  //
  //      tempArray.push(
  //       <div>
  //        <h2>Open Games:</h2>
  //       </div>
  //      );
  //
  //      for (i = 0; i < results.length; i++) {
  //        console.log('Image %s', i);
  //        let id = results[i]._id;
  //        let desc = results[i].desctiption;
  //        console.log(id);
  //
  //        tempArray.push(
  //         <div>
  //          <h4>Description: {desc}</h4>
  //          <button id={id} value={id} onClick={this.onClick}>View</button>
  //        </div>
  //        );
  //      }
  //      console.log('Results added to state:')
  //      console.log(tempArray)
  //      this.setState({ games:tempArray})
  //    });
  // }


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
      //<button id={game.id} value={game.id} onClick={this.onClick}>View</button>
    let listOfGames = this.state.games.map(game =>
      <li className="game-list" key={game._id}>{game.description}
      </li>
    );

    var gamedata = this.state.games;

      console.log("gamedata", gamedata);
      console.log("list", listOfGames);

     const { description } = this.state
    let title = (
      <div>
        <h1>Backyard Safari</h1>
        <h2>Find a Game</h2>
      </div>
    );

    const selectOptions = {
      g_status: 'Open',
      g_status: 'Closed',
    };
    const columns = [{
      dataField: 'description',
      text: 'Game Description',
      filter: textFilter(),
      headerAlign: 'left',
      align: 'left'
    }, {
      dataField: '_id',
      text: 'Game ID',
      headerAlign: 'center',
      filter: textFilter(),
      align:"left"
    }, {
      dataField: 'g_status',
      text: 'Status',
      filter: textFilter(),
      headerAlign: 'center',

    }];

    const rowEvents = {
      onClick: (e, row, rowIndex) => {
        console.log('CLICK', row)
        const input = row._id
        console.log(row._id);
        console.log(input);
        console.log('onClick ID is', input);
        const params = {
        gameId : input,
        }
        localStorage.setItem(LOCAL_GAME_KEY, JSON.stringify(params));
        console.log("LOCAL_GAME_KEY:", localStorage.getItem(LOCAL_GAME_KEY))
        this.props.history.push("/viewgame")
      }


    };

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

          </Grid>

        </form>
        <h3 style={{ borderRadius: '0.25em', textAlign: 'center', color: 'black', border: '2px solid black', padding: '0.1em' }}>Click to Challenge!</h3>
        <BootstrapTable keyField='id' data={ gamedata } columns={ columns } rowEvents={ rowEvents } filter={ filterFactory() }
        striped
        hover
        bordered={ false }
         />
        <Form onSubmit={this.goHome} style={{marginTop:60}}>
        <Grid>
           <Grid.Column  textAlign='center' width={4}>
              <Button
                style={{width: '100%'}}
                type='submit'>Home</Button>
            </Grid.Column>
          </Grid>
        </Form>
        <Grid.Column textAlign='center' width={16}>
        </Grid.Column>
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
