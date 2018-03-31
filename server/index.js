const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
//var ImageUploader = require('../utils/imageUploader');

app.post('/api/v1/image', function (req, res) {

  //FIXME! - Handle image uploading here
  console.log("Request received for server/upload");
  res.send({
    status: 'success'
  });

//  var image = ImageUploader({
//    data_uri: req.body.data_uri,
 //   filename: req.body.filename,
  //  filetype: req.body.filetype
//  }).then(onGoodImageProcess, onBadImageProcess);



  function onGoodImageProcess(resp) {
    res.send({
      status: 'success',
      uri: resp
    });
  }

  function onBadImageProcess(resp) {
    res.send({
     status: 'error'
    });
  }

});

app.get('/home', (req, res) => {
  console.log("Request received for server/home");
  res.send({ express: 'BACKYARD SAFARI - DEPLOYMENT PORTAL'});
});

app.get('/login', (req, res) => {
  //FIXME! - Need to pass login credeintials here to DB
  console.log("Request received for server/login");
  res.send({ express: 'Login Request Received'});
});

app.get('/signup', (req, res) => {
  //FIXME! - Need to pass signup credeintials here to DB
  console.log("Request received for server/login");
  res.send({ express: 'Signup Request Received'});
});

app.listen(port, () => console.log(`Listening on port ${port}`));
