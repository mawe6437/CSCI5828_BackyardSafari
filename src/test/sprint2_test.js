// import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
// import { createAccount } from '../utils/MyAPI';

global.expect = expect;

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../components/App.js')
chai.use(chaiHttp);

describe('Check whether it works properly', function(){
  it('should work well', function(){
    expect(true).to.be.true;
  });
});

describe('A user enters to the server.', function(){
  it('should get status OK', function(){
    chai.request(server)
    .get('/')
    expect(res).body.status.should.equal('OK');
  });
});


// describe('homepage', function(){
//   it('should respond to GET',function(){
//     superagent
//       .get('http://localhost:'+port)
//       .end(function(res){
//         expect(res.status).to.equal(200);
//         done();        
//     })
//   })


// decribe('GET', function(){
//   describe('homepage and check for valid response', function(){
//     it('should return a 200 response', function(done){
//       api.get('/')
//       .set('Accept', 'application/json')
//       .expect(200, done);
//     });
//   });
// });






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


// expect(res).to.have.status(200);

// 2.  When a user tries to login, check whether information that a user put is correct or not.
//   //when
//   var result1 = validate.email('test@naver.com');
//   var result2 = validate.email('test_1234@naver.com');
//   var result3 = validate.email('!@test@naver.com');
//   var result4 = validate.email('test#naver.com');
//   var result5 = validate.email('test');
//   var result6 = validate.email('naver.com');
//   //then
//   expect(result1).to.be.true;
//   expect(result2).to.be.true;
//   expect(result3).to.be.false;
//   expect(result4).to.be.false;
//   expect(result5).to.be.false;
//   expect(result6).to.be.false;

// 3. Check whether a user puts information correctly to the create login page.
//     Plus, a user has to put both ID and password:
//     should.have.property('ID');

// var user = {name: 'Scott'};
// expect(user).to.have.property('name');

// 4. Check whether a user can see dashboard page after login.

// 5.  Check whether a user puts both description and path of image in the imageupload page.
// expect(user).to.have.property('description');
// expect(user).to.have.property('path_of_image');
