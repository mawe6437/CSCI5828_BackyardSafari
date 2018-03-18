import React, { Component } from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import './App.css';
import logo from './logo.svg';

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

  callLogin = async () => {
    const response = await fetch('/login');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);

    return body;
  };
        
  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = event => {
    event.preventDefault();

      //.then(res=>this.setLogin({login: res.express}))
    this.callLogin()
      .then(res=>alert(res.express))
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="Login">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Backyard Safari</h1>
        <p className="App-intro">{this.state.response} </p>
        </header>
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="email" bsSize="large">
            <ControlLabel>Email</ControlLabel>
            <FormControl
              autoFocus
              type="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>Password</ControlLabel>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <Button
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
          >
            Login
          </Button>
        </form>
      </div>
    );
  }
}

export default App;
