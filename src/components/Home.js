import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

// semantic-ui
import { Container, Grid } from 'semantic-ui-react'

import LoginForm from './LoginForm'
import title_img from './pics/title.png'


class Home extends Component {

  render() {
    let title = (
      <div>
        <img className='title_image' src={title_img}/>
      </div>
    );
    return(
        <Container className='home' style={{textAlign: 'center'}}>

        <Grid style={{marginTop:60}}>
          <Grid.Column textAlign='right' width={16}>
            <Link to="/create_acount"><b><font color="white">Create an account</font></b></Link>
          </Grid.Column>
          <Grid.Column textAlign='center' width={16}>
            {title}
          </Grid.Column>
        </Grid>
        <LoginForm />

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
