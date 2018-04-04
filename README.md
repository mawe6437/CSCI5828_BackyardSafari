## Example of basic account system on React and MongoDB
This is an example web application written in React to demonstrate basic account feature with MongoDB.
You can create an account and sign in with email or tokens.  
I borrowed ( ported ) most of code from Meteor's account package which I love.
I ported Meteor's account package because I could not find good examples to develop simple signup/signin system without using Meteor when I start using React

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
API server is going to start on port 3002
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

### You need MongoDB. Here's an example of installing MongoDB on mac os X  

```
brew update   
brew install mongodb  
mkdir mongodb_data  
mongod --dbpath mongodb_data/  
```

## License  
MIT. You can do whatever you want.  
