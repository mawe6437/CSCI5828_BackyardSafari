// import React from 'react';
// import { shallow, mount, render } from 'enzyme';
import { expect } from 'chai';

import * as MyAPI from '../utils/MyAPI'

global.expect = expect;

// Testing function is okay?
// $mocha src/test/setup.js src/test/sprint2_test.js
describe('Is test working?', function(){
  it('should work well', function(){
    expect(true).to.be.true;
  });
});

// Test1: Check LoginForm
// Give correct/wrong ID/PW
describe('Check LoginForm', function(){
  it('should pass with correct login ID/PW', function(){
    const params = {
      email: 'test2',
      password: 'test2',
    }
    MyAPI.signinWithPassword(params)
    .then((data) => {
    expect(data.status).to.equal('success');
    });
  });

  it('should have error with wrong login ID/PW', function(){
    const params = {
      email: 'test2',
      password: 'test3',
    }
    MyAPI.signinWithPassword(params)
    .then((data) => {
    expect(data.status).to.equal('error');
    });
  });  
});

// Test2: Check CreateAccount
// Give correct/wrong ID/PW
describe('Check CreateAccount', function(){
  it('should create an account with correct ID/PW', function(){
    const params = {
      // Need to change email/password whenever testing it
      // So use Date.now() to get new ID whenever testing.
      email: Date.now(),
      password: 'test2',
    }
    MyAPI.createAccount(params)
    .then((data) => {
    expect(data.status).to.equal('success');
    });
  });

  it('should have error with blank in the ID field', function(){
    const params = {
      email: '',
      password: 'test2',
    }
    MyAPI.createAccount(params)
    .then((data) => {
    expect(data.status).to.equal('error');
    });
  });  

  it('should have error with existing ID/PW ', function(){
    const params = {
      email: 'test2',
      password: 'test2',
    }
    MyAPI.createAccount(params)
    .then((data) => {
    expect(data.status).to.equal('error');
    });
  });

});










// 0. connecting dashboard
//     before(function(done) {
//         Camo.connect('mongodb://localhost/app_test').then(function(db) {
//             database = db;
//             return database.dropDatabase();
//         }).then(function() {}).then(done, done);
//     });



// 1. send 200 msg when a user request server.(for homepage)

// chai.request(app)  
//     .put('/api/auth')
//     .send({username: 'scott@stackabuse.com', passsword: 'abc123'})
//     .end(function(err, res) {
//         expect(err).to.be.null;
//         expect(res).to.have.status(200);
//     });


// expect(res).to.have.status(200)

// 4. Check whether a user can see dashboard page after login.

// 5.  Check whether a user puts both description and path of image in the imageupload page.
// expect(user).to.have.property('description');
// expect(user).to.have.property('path_of_image');
