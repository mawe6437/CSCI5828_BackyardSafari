## Added/modified file
#### .bablerc
#### package.json 
- added some packages. There are some unnecessary one, but it is hard to figure out.
- In the scripts section, you can see “test”. I put my mocha script there. So you can launch mocha with “mocha src/test/setup.js src/test/sprint2_test.js” or “npm run test”
#### MyAPI.js
- In line 15, 27, 47, and more, you can see “headers”. It was 

```javascript
headers: {
  ...headers,
  'Content-Type': 'application/json'
},
```

   And “...headers” correspond to this on the top in the code

```javascript
const headers = {
  'Accept': 'application/json',
  'Authorization': API_KEY
}
```

but I changed since Mocha cannot read “...headers” for some reason.

```javascript
headers: {
  'Accept': 'application/json',
  'Authorization': API_KEY,
  'Content-Type': 'application/json'
},
```

#### setup.js
- Honestly, I don’t know much about this. But it is required to test our code.

#### sprint2_test.js
- This is main part for test
- Our main functions are in the **/server/routes/api.js.** And functional .js files like *CreateAccount.js*, *ImageUpload.js*, *LoginForm.js* call **/src/utils/MyAPI.js.** Then MyAPI.js sends parameters to **/server/routes/api.js.**
- In order to test our program, we can send some parameters to MyAPI.js and get response from api.js

##### Test case1: Check LoginForm
- When user enters to our page, first page is *LoginForm*. Users may put anything in the ID/PW boxes and *api.js* will check whether ID/PW is correct or not.
- So we can test *LoginForm* page **by sending correct/wrong ID/PW(parameters)** to *api.js* using *MyAPI.js*
- This is login function in line 24 of MyAPI.js. It received **params** and send them to *api.js*

```javascript
export const signinWithPassword = (params) =>
  fetch(`${api}/login_with_email_password`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify( params )
  }).then(res => res.json())
```

- And *params* comes from *LoginForm.js* (line 26)

```javascript
const { email, password } = this.state
const params = {
  email: email,
  password: password,
}

// create account
MyAPI.signinWithPassword(params)
.then((data) => {
```

- Now I understand how it works and I can use it. I can send arbitrary **params** to MyAPI.js and receive its response.

```javascript
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
```

I’m sending *test2/test2* which is correct information to **signinWithPassword** function in MyAPI using *(params)* and get response and save it to **data**.

So what does data look like?
In the *api.js*, there is a function called **login_with_email_password**. It is called by *MyAPI.signinWithPassword.*
If you go down, you can see **res.json** in line 225 and line 235.

```javascript
res.json({
  status: 'success',
  user: user_info,
  login_token: login_token,
})
```

And this **status** is the result what we want. If you see this *login_with_email_password* function more, you will notice that it returns “success” with correct ID/PW and returns “error” with incorrect ID/PW.

Let’s go back to *sprint2_test.js.*
It check **data.status**. 
When **params** is **correct** ID/PW(test2/test2 is correct), *data.status* should be equal to ‘success’. If not, this test will not pass.
When **params** is **incorrect** ID/PW(test2/test3 is incorrect), *data.status* should be equal to ‘error’. 

```javascript
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
```

**Test2: Check CreateAccount** is similar to Test1. If you understand *api.js*, *MyAPI.js*, and *.js what you want to check*, it is not difficult to write some test codes. 
After finishing this, we need to figure out what we can test more.
