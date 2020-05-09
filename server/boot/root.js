// Copyright IBM Corp. 2016,2019. All Rights Reserved.
// Node module: loopback-workspace
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';
const passwordHash = require('password-hash');

module.exports = function(server) {
  const router = server.loopback.Router();
  const dbConnector = server.dataSources.login_details;
  server.use(router);
  //Load Login page on initial request
  server.get('/', (req, res) => {
    try{
      if (req.session == null || req.session.username == null) {
        res.redirect('client/login.html');
      }
    }catch(err){
      res.send('404 : Error while loding login page');
    }
  
  });
  server.post(`/login`, (req, res) => {
    const { 
      email,
      password
    } = req.body;
    const hashPassword =  passwordHash.generate(password);
    const auth = passwordHash.verify(password, hashPassword);
    if(auth){
      dbConnector.connector.execute(`SELECT * FROM user where email_id = ? and password = ?;`, [email, password],function (err, get_user) {
        if (err) {
          console.log("Error while getting FIPS" + err);
          res.send('error');
        }else{
          res.send('success');
        }
      });
    }else{
      res.send('Authentification failed');
    }
  });

  server.post(`/add_user`, (req, res) => {
    const { 
      password,
      email
    } = req.body;
    const hashPassword =  passwordHash.generate(password);
    let insertQuery = `INSERT INTO user (user_name, password, email_id) VALUES ('${username}','${hashPassword}','${email}');`;
    dbConnector.connector.execute(insertQuery, function (err, addUser) {
      if (err) {
        console.log("Error while getting FIPS" + err);
        res.send({
          status: 'error',
          details: err.sqlMessage
        });
      }else if(addUser.length == 0){
        res.send({
          status: 'error',
          details: 'No user added'
        });
      }else{
        res.send({
          status: 'success',
          details: `New user ${username} added successfully`
        });
      }
    });
  });

  server.get(`/get_all_users`, (req, res) => {
    let selectAllUsers  = `select user_name,password,email_id from user;`
    dbConnector.connector.execute(selectAllUsers, (err, allUser) => {
      if (err) {
        console.log("Error while getting FIPS" + err);
        res.send({
          status: 'error',
          details: err.sqlMessage
        });
      }else if(allUser.length == 0){
        res.send({
          status: 'error',
          details: 'No user added'
        });
      }else{
        const allUserList = JSON.stringify(allUser);
        res.send({
          status: 'success',
          details: `${allUserList}`
        });
      }
    });
  })
};
