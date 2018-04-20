## Backyard Safari !
Built as a simple web application written in React with account longin capabilities with MongoDB. Inspired by pokemonGO, the user can then can create a game by uploading an image and description, with games stored in the MongoDB via a Node server. The App also has Search Games and My Games pages to view all games or games specific to the user. The user can then click on a game to view it and challenge other users with other uploaded images.

## Install  
```
git https://github.com/kouohhashi/react_mongo_accounts.git
cd react_mongo_accounts
npm install
```

## modify database name on routes/api.js  
This has been modified to: 'mongodb://admin:5828@ds123499.mlab.com:23499/backed_safari_db'
This is an mLab central mongodb

## Usage: IMPORTANT
IF you want to use your own server on your EC2 instance or on a remote server in production, you must replace line 2 in src/utils/MyAPI.js with the web address of your server. In my case:
http://ec2-18-188-26-9.us-east-2.compute.amazonaws.com:3002

Otherwise, this will point to mine (which is currently up and running April 2018).

### Start API server  
API server is going to start on port 3002. Utilizes Nodemon for quick server updates.
```
npm run start_server
```

### Start React  
React is going to start on port 3000
```
npm run start_react
```

You can check at http://localhost:3000  or the web address at port 3000

## Requirement  

### You need MongoDB. We recommend mLab as above.
