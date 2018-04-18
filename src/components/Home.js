import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

// semantic-ui
import { Container, Grid } from 'semantic-ui-react'

import LoginForm from './LoginForm'

class Home extends Component {

  render() {
    let title = (
      <div>
        <h1>Backyard Safari</h1>
      </div>
    );
    return(
        <Container className='home' style={{textAlign: 'center'}}>

        <Grid style={{marginTop:60}}>
          <Grid.Column textAlign='right' width={16}>
            <Link to="/create_acount">Create an account</Link>
          </Grid.Column>
          <Grid.Column textAlign='center' width={16}>
            {title}
          </Grid.Column>
        </Grid>
        <LoginForm />
        <script src="chai.js"></script>
        <script src="chai-http.js"></script>
        <script>
          chai.use(chaiHttp);
        </script>
        </Container>
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
export default withRouter( connect( mapStateToProps )(Home) )
