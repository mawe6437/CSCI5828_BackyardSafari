import uuid from 'uuid';
import sha256 from 'sha256'
import crypto from 'crypto'
import bcrypt from 'bcrypt'

// change this
const db_name = 'backed_safari_db'

// Connection URL
import MongoDbHelper from './MongoDbHelper';
let url = 'mongodb://admin:5828@ds123499.mlab.com:23499/backed_safari_db';
let mongoDbHelper = new MongoDbHelper(url);
const API_KEY = '__api_key__'

// start connection
mongoDbHelper.start(() => {
  console.log("mongodb ready")
});

// generate random string
function makeid (count) {
  if (!count){
    count = 5;
  }

  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for( var i=0; i < count; i++ )
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

// index
exports.echo = (req, res) => {

  const { login_token } = req.session

  res.json({
    status: 'OK',
    login_token: login_token
  });
}

// create user
exports.create_user = (req, res) => {

  let password =  req.body.password;
  let email =  req.body.email;
  let api_key =  req.headers.authorization

  if (api_key !== API_KEY){
    res.json({ status: 'error', detail: 'api key is invalid' });
    return;
  }

  let user_info = {}
  let login_token

  let find_param = {
    'emails.address':email
  }
  mongoDbHelper.collection("users").count(find_param)
  .then((results) => {
    return new Promise((resolve, reject) => {
      if (results != 0){
        reject("user already exist")
      }
      resolve()
    })
  })
  .then(() => {
    // bcrypt of password
    let password2 = sha256(password)
    var bcrypt_hash = bcrypt.hashSync(password2, 10);

    // login token which to use login
    login_token = makeid('4') + parseInt(new Date().getTime()).toString(36);
    const hashed_token = crypto.createHash('sha256').update(login_token).digest('base64');

    const token_object = {
      'when':new Date(),
      'hashedToken':hashed_token,
    };

    let insert_params = {
      createdAt: new Date(),
      services:{
        password : {
          bcrypt : bcrypt_hash
        },
        resume : {
          loginTokens : [token_object]
        },
        email : {
          verificationTokens : [
            {
              // nameHash : nameHash,
              address : email,
              when : new Date(),
            }
          ]
        },
      },
      emails : [
        {
          "address" : email,
          "verified" : false
        }
      ],
      profile : {},
    }

    // insert
    return mongoDbHelper.collection("users").insert(insert_params)
  })
  .then((results) => {

    if ( results === null ) {
      res.json({ status: 'error', detail: 'no such user' });
      return;
    }

    user_info._id = results._id;
    user_info.profile = results.profile;

    // req.session.userId = user_info._id
    req.session.login_token = login_token // maybe not necessary

    res.json({
      status: 'success',
      user: user_info,
      login_token: login_token,
    })

  })
  .catch((err) => {
    res.json({ status: 'error', detail: err });
  })
}

// login with email and password
exports.login_with_email_password = (req, res) => {

  let password =  req.body.password;
  let email =  req.body.email;
  let api_key =  req.headers.authorization

  if (api_key !== API_KEY){
    res.json({ status: 'error', detail: 'api key is invalid 2' });
    return;
  }

  let find_param = {
    'emails.address':email
  }

  let user_info = {};
  let login_token

  // insert
  mongoDbHelper.collection("users").findOne(find_param)
  .then((results) => {
    // check password

    return new Promise( (resolve, reject) => {

      if (!results){
        reject("no such user")
      }
      if (!results.services || !results.services.password || !results.services.password.bcrypt){
        reject("something must be wrong")
      }

      // set user info
      user_info._id = results._id;
      user_info.profile = results.profile;

      let password2 = sha256(password)

      const saved_hash = results.services.password.bcrypt

      bcrypt.compare(password2, saved_hash, (err, res) => {
        if (err){
          reject(err)
        }

        if (res === true){
          resolve()
        } else {
          reject("password is not valid")
        }
      });
    } )
  })
  .then(() => {
    // issue token

    let find_param = {
      _id: user_info._id
    }

    // login token
    login_token = makeid('4') + parseInt(new Date().getTime()).toString(36);
    const hashed_token = crypto.createHash('sha256').update(login_token).digest('base64');

    const token_object = {
      'when':new Date(),
      'hashedToken':hashed_token,
    };

    let upd_param = {
      '$push':{
        'services.resume.loginTokens':token_object
      }
    };

    // update
    return mongoDbHelper.collection("users").update(find_param, upd_param)
  })
  .then((results) => {

    // set session
    req.session.login_token

    res.json({
      status: 'success',
      user: user_info,
      login_token: login_token,
    })

  })
  .catch((err) => {
    res.json({status: 'error', detail: err})
  })
}

// logout
exports.logout = (req, res) => {

  // let login_token = req.body.login_token;
  let login_token = req.session.login_token;
  if (!login_token){
    // user is not login
    res.json({status: 'success'})
    return;
  }

  let api_key =  req.headers.authorization


  if (api_key !== API_KEY){
    res.json({ status: 'error', detail: 'api key is invalid' });
    return;
  }

  const hashed_token = crypto.createHash('sha256').update(login_token).digest('base64');
  let find_param = {
    'services.resume.loginTokens':{
      '$elemMatch':{
        'hashedToken':hashed_token
      }
    }
  }

  // find user
  mongoDbHelper.collection("users").findOne(find_param)
  .then((results) => {

    if (results === null){
      return Promise.reject("no such token")
    }

    let find_param = {
      '_id':results._id
    };
    var upd_param = {
      '$pull':{
        'services.resume.loginTokens':{
          'type':'ios'
        }
      }
    };
    return mongoDbHelper.collection("users").update(find_param, upd_param)
  })
  .then(() => {
    return new Promise((resolve, reject) => {

    })
    req.session.destroy((err) => {
      if (err) {
        reject(err)
      }
      resolve()
    })
  })
  .then(() => {
    res.json({status: 'success'})
  })
  .catch((err) => {
     res.json({status: 'error', detail: err})
  })
}

// login_with_token
exports.login_with_token = (req, res) => {

  let login_token =  req.body.login_token;
  let api_key =  req.headers.authorization

  if (api_key !== API_KEY){
    res.json({ status: 'error', detail: 'api key is invalid' });
    return;
  }

  let user_info = {};

  const hashed_token = crypto.createHash('sha256').update(login_token).digest('base64');
  let find_param = {
    'services.resume.loginTokens':{
      '$elemMatch':{
        'hashedToken':hashed_token
      }
    }
  }

  // find user
  mongoDbHelper.collection("users").findOne(find_param)
  .then((results) => {
    // set user info

    if ( results === null ) {
      res.json({ status: 'error', detail: 'no such user' });
      return;
    }

    user_info._id = results._id;
    user_info.profile = results.profile;

    // set session
    req.session.login_token

    // return success
    res.json({
      status: 'success',
      user: user_info,
      login_token: login_token,
    })
  })
  .catch((err) => {
    res.json({status: 'error', detail: err})
    console.log("err:", err)
  })
}

// upload picture
exports.upload_image = (req, res) => {
  console.log("Server: Calling upload_image!")
  console.log("req"); //form fields
  console.log(req.body.filename);
  console.log(req.body.filetype);
  console.log(req.body.description);

  // FIXME! - Add userId here
  let insert_params = {
      data_uri: req.body.data_uri,
      filename: req.body.filename,
      filetype: req.body.filetype
  }

  // insert
  mongoDbHelper.collection("mwImages").insert(insert_params)
    .then((results) => {
      console.log('Image added to DB!')
      res.json({status: 'success', uri:insert_params.data_uri, imageId: results._id
      });
  })
  .catch((err) => {
    res.json({status: 'error', detail: err})
    console.log("err:", err)
  })
}

// upload game
exports.upload_game = (req, res) => {
  console.log("Server: Calling upload_game!")
  console.log("req"); //form fields
//  console.log(req.body.m_image);
  console.log(req.body.m_userId);
  console.log(req.body.c_image);
  console.log(req.body.c_userId);
  console.log(req.body.description);
  console.log(req.body.status);

  let time = new Date();
  let start_time = time.getTime();

  //console.log("time before", displayTime);
  let display_time = "";
  let hours = time.getHours()
  let minutes = time.getMinutes()
  let seconds = time.getSeconds()

  if (minutes < 10) {
    minutes = "0" + minutes
      }

      if (seconds < 10) {
        seconds = "0" + seconds
      }

      display_time += hours + ":" + minutes + ":" + seconds + " ";

      if(hours > 11){
        display_time += "PM"
      } else {
        display_time += "AM"
      }
      console.log("time after", display_time);

  let insert_params = {
      m_image: req.body.m_image,
      m_userId: req.body.m_userId,
      c_image: req.body.c_image,
      c_userId: req.body.c_userId,
      description: req.body.description,
      g_status : req.body.g_status,
      g_start_time : start_time,
      g_time_start_display : display_time,
      g_end_time : null,
      g_end_start_display : null,
      g_score : null
  }

  // insert
  mongoDbHelper.collection("newGameTable").insert(insert_params)
    .then((results) => {
      console.log('Game added to DB!')
      res.json({status: 'success',
                gameId:results._id,
                g_status:insert_params.g_status,
                uri:insert_params.m_image,
                g_time_start:insert_params.g_start_time,
                g_time_start_display:insert_params.g_time_start_display
      });
  })
  .catch((err) => {
    res.json({status: 'error', detail: err})
    console.log("err:", err)
  })
}

// update game
exports.update_game = (req, res) => {
  console.log("Server: Calling update_game!")
  console.log("req"); //form fields
  console.log(req.body.game_id);

   let find_param = {
      _id: req.body.game_id
    }

    let upd_param = {
      $set: {
      m_image: req.body.m_image,
      m_userId: req.body.m_userId,
      c_image: req.body.c_image,
      c_userId: req.body.c_userId,
      description: req.body.description,
      g_status : req.body.g_status,
      g_end_time : req.body.g_end_time,
      g_end_time_display : req.body.g_end_time_display,
      g_score : req.body.g_score
      }
    }

    // update
    mongoDbHelper.collection("newGameTable").update(find_param, upd_param)
    .then((results) => {
      console.log('Game updated in DB!')
      res.json({status: 'success', results
      });
  })
  .catch((err) => {
    res.json({status: 'error', detail: err})
    console.log("err:", err)
  })
}

// get user games
exports.get_mygames = (req, res) => {
  console.log("Server: Calling get_mygames!")
  console.log("req"); //form fields
  console.log(req.body.user_id);

  // Get both master and challenger games
  let find_param = {
    $or: [
      { m_userId: req.body.user_id},
      { c_userId: req.body.user_id}
    ]
  }

  // find
  mongoDbHelper.collection("newGameTable").find(find_param)
    .then((results) => {
      console.log('Games retrieved from DB!')
      res.json({status: 'success', results
      });
  })
  .catch((err) => {
    res.json({status: 'error', detail: err})
    console.log("err:", err)
  })
}

//finds all games
exports.search_games = (req, res) => {
  mongoDbHelper.collection("newGameTable").find({'g_status':'open'})
  .then((data) => {
    // set user info
    if ( data === null ) {
      res.json({ status: 'error', detail: 'no data in database' });
      return;
    }
    res.json(data);
  })
}

//finds a specific game by its description
exports.search_games_description = (req, res) => {
  mongoDbHelper.collection("newGameTable").find(find_param).then(data => {
    res.json(data);
   })
}


// get a game
exports.get_game = (req, res) => {
  console.log("Server: Calling get_game!")
  console.log("req"); //form fields
  console.log(req.body.gameId);

  let find_param = {
      _id: req.body.gameId
  }

  // insert
  mongoDbHelper.collection("newGameTable").findOne(find_param)
    .then((results) => {
      console.log('Game retrieved from DB!')
      res.json({status: 'success', results
      });
  })
  .catch((err) => {
    res.json({status: 'error', detail: err})
    console.log("err:", err)
  })
}

// delete a game
exports.delete_game = (req, res) => {
  console.log("Server: Calling delete_game!")
  console.log("req"); //form fields
  console.log(req.body.gameId);

  let del_param = {
      _id: req.body.gameId
  }

  // insert
  mongoDbHelper.collection("newGameTable").delete(del_param)
    .then((results) => {
      console.log('Game deleted from DB!')
      res.json({status: 'success', results
      });
  })
  .catch((err) => {
    res.json({status: 'error', detail: err})
    console.log("err:", err)
  })
}

// Insert new user log event
exports.upload_log = (req, res) => {
  console.log("Server: Calling upload_log!")
  console.log("req"); //form fields
  console.log(req.body.m_userId);
  console.log(req.body.log_entry);
  let time = new Date();
  let start_time = time.getTime();

  //console.log("time before", displayTime);
  let display_time = "";
  let hours = time.getHours()
  let minutes = time.getMinutes()
  let seconds = time.getSeconds()

  if (minutes < 10) {
    minutes = "0" + minutes
  }

  if (seconds < 10) {
    seconds = "0" + seconds
  }

  display_time += hours + ":" + minutes + ":" + seconds + " ";

  if(hours > 11){
    display_time += "PM"
  } else {
    display_time += "AM"
  }
  console.log("time after", display_time);

  // FIXME! - add timestamp here
  let insert_params = {
      userId: req.body.m_userId,
      log_time: display_time,
      log_entry: req.body.log_entry
  }

  // insert
  mongoDbHelper.collection("logTable").insert(insert_params)
    .then((results) => {
      console.log('Log added to DB!')
      res.json({status: 'success', results });
  })
  .catch((err) => {
    res.json({status: 'error', detail: err})
    console.log("err:", err)
  })
}

// get user log
exports.get_mylog = (req, res) => {
  console.log("Server: Calling get_mylog!")
  console.log("req"); //form fields
  console.log(req.body.user_id);

  // Get both master and challenger games
  let find_param = {
    userId: req.body.user_id
  }

  // find
  mongoDbHelper.collection("logTable").find(find_param)
    .then((results) => {
      console.log('Logs retrieved from DB!')
      res.json({status: 'success', results
      });
  })
  .catch((err) => {
    res.json({status: 'error', detail: err})
    console.log("err:", err)
  })
}
