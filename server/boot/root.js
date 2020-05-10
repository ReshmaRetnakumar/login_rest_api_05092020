// Copyright IBM Corp. 2016,2019. All Rights Reserved.
// Node module: loopback-workspace
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';
const passwordHash = require('password-hash');
const MongoClient = require('mongodb').MongoClient;
//Create a database named "mydb":
const url = "mongodb://localhost:27017/login_info";
const fs = require('fs');
const jwt = require('jsonwebtoken');
const secreteKey = process.env.SECRET_KEY;
const privateKey = fs.readFileSync('./private.pem', 'utf8');    
const jwtExpirySeconds = 300;

module.exports = function (server) {
  const router = server.loopback.Router();
  server.use(router);
  //Load Login page on initial request
  server.get('/', (req, res) => {
    try {
      if (req.session == null || req.session.username == null) {
        res.redirect('client/login.html');
      }
    } catch (err) {
      res.send('404 : Error while loding login page');
    }

  });
  server.post(`/login`, (req, res) => {
    const {
      email,
      password
    } = req.body;
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      const dbObject = db.db("login_info");
      const condition = { email_id: email, password : password }; 
      dbObject.collection("user").find(condition).toArray(function(err, validateUser) {
        if (err) throw err;
        console.log(validateUser);
        db.close();
        if(validateUser.length == 0){
          res.send({
            status: 'errot',
            details: 'Authentication failed'
          });
        }else{
          res.cookie('token',validateUser[0].token, { maxAge: jwtExpirySeconds, httpOnly: true });
          res.send({
            status: 'success',
            details: `Welcome ${username}!!!!`
          })
        }
 
      });  
    });
  });

  server.post(`/add_user`, (req, res) => {
    const {
      username,
      password,
      email
    } = req.body;
    const uniqueId = `${username}_${password}`
    const nowDate = new Date();
    nowDate.setSeconds(nowDate.getSeconds() + jwtExpirySeconds);
    const expireTime = `${nowDate.getHours()}:${nowDate.getMinutes()}:${nowDate.getSeconds()}`;
    let token = jwt.sign({ "user_info": uniqueId }, secreteKey, { algorithm: 'HS256', expiresIn: jwtExpirySeconds });
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      const dbObject = db.db("login_info");   
      var userObj = { user_name: username, password: password, email_id: email, token : token, token_expires_in: expireTime};
      dbObject.collection("user").insertOne(userObj, function (err, addUser) {
        if (err) throw err;
        else if (addUser.insertedCount == 0) {
          res.send({
            status: 'error',
            details: 'No user added'
          });
        }else {
          res.send({
            status: 'success',
            details: `New user ${username} added successfully`
          });
        }
        db.close();
      });
    });
  });

  server.get(`/get_all_users`, (req, res) => {
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      const dbObject = db.db("login_info");   
      dbObject.collection("user").find({}).toArray(function(err, allUser) {
        if (err) throw err;
        db.close();
        console.log(allUser);
        if(allUser.length ==0){
          res.send({
            status:'error',
            details: 'No users'
          })
        }else{
          res.send(allUser);
        }
      });
  });
});
};
