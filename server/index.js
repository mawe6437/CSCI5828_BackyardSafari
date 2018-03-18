const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/home', (req, res) => {
  console.log("Request received for server/home");
  res.send({ express: 'BACKYARD SAFARI - DEPLOYMENT PORTAL'});
});

app.get('/login', (req, res) => {
  console.log("Request received for server/login");
  res.send({ express: 'Login Request Received'});
});

app.listen(port, () => console.log(`Listening on port ${port}`));
