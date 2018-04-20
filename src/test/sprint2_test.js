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

// Test1: Check LoginForm.js
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

// Test2: Check CreateAccount.js
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


// Test3: Check CreateGame.js
describe('Check CreateGame', function(){
  //since api.js doesn't define any error cases for this function, 
  //only 'success' test is needed.
  it('Should pass with correct information\n\t(game description and a path of an image)', function(){
    const game_params = {
       m_image: 'test_for_mocha',
       m_userId: '309151d0-37d2-11e8-8c49-07c9331c8024',
       c_image: null,
       c_userId: null,
       description: 'test_for_mocha',
       g_status: "open"
    }
    MyAPI.upload_game(game_params)
    .then((data) => {
      expect(data.status).to.equal('success');
    });
  });
});   


// Test4: Check MyGames.js
describe('Check MyGames', function(){
  //since api.js doesn't define any error cases for this function, 
  //only 'success' test is needed.
  it('Should pass with any userID. \n\tIt does not matter whether that user has games or not.', function(){
    const mygame_params = {
          user_id: 'adddddddddddddddd'
    }
    MyAPI.get_mygames(mygame_params)
    .then((data) => {
      expect(data.status).to.equal('success');
    });
  });
});   

// Test5: Check SearchGames.js
describe('Check SearchGames', function(){
  //since api.js doesn't define any error cases for this function, 
  //only 'success' test is needed.
  it('Should pass if it can call search_games function.\n\t If there is no existing game, error state should be provided.', function(){
    MyAPI.search_games()
    .then((data) => {
      if (data==null) {
        expect(data.status).to.equal('error');    
      }
    });
  });
});   


// Test6: Check ViewGame.js
describe('Check ViewGame', function(){
  //since api.js doesn't define any error cases for this function, 
  //only 'success' test is needed.
  it('Should pass with any gameID. \n\tIt does not matter whether that gameId exists or not.', function(){
    const param = {
      gameId: 'testID_not_exist'
    }
    MyAPI.get_game(param)
    .then((data) => {
      expect(data.status).to.equal('success');
    });
  });
});   

