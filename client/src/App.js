import React, { Component } from "react";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import { Link } from "react-router-dom";
import './App.css';
import Routes from "./Routes";
import { LinkContainer } from "react-router-bootstrap";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      response: 'TEST',
      login: ''
    };
  }

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('/home');
    const body = await response.json();
    console.log("Response from fetch: ",body);
    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  render() {
    return (
      <div className="App container">
       <Navbar fluid collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">Backyard Safari</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
            <LinkContainer to="/signup">
              <NavItem>Signup</NavItem>
            </LinkContainer>
            <LinkContainer to="/login">
              <NavItem>Login</NavItem>
            </LinkContainer>
            <LinkContainer to="/upload">
              <NavItem>Upload</NavItem>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Routes />
      </div>
    );
  }
}

export default App;
