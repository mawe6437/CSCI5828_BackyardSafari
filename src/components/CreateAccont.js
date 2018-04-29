import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

// semantic-ui
import { Container, Grid } from 'semantic-ui-react'

import CreateAccontForm from './CreateAccontForm'
import title_img from './pics/title.png'


class CreateAccont extends Component {

  render() {
    let title = (
      <div>
        <img className='title_image' src={title_img}/>
      </div>
    );

    return(
      <Container className='create_acount' style={{textAlign: 'center'}}>
        <Grid style={{marginTop:60}}>
          <Grid.Column textAlign='right' width={16}>
            <Link to="/"><b><font color="white">Sign in</font></b></Link>
          </Grid.Column>
          <Grid.Column textAlign='center' width={16}>
            {title}
          </Grid.Column>
        </Grid>
        <CreateAccontForm />
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
export default withRouter( connect( mapStateToProps )(CreateAccont) )
