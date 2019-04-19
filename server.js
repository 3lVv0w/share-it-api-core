'use strict';

require('dotenv').config();
const morgan = require("morgan");
const express = require("express");
var pg = require('knex')({
  client: 'pg',
  connection: {
    database: 'share_it',
    user: 'postgres',
    password: 'password',
  },
  searchPath: ['knex', 'public'],
});
//const router = require("./routes/api");
const bodyParser = require("body-parser");
const { join } = require("path");
const serveStatic = require("serve-static");

const app = express();

app.set("json spaces", 2);
app.use(morgan("dev"));
app.use(require("cors")());

app.use(
  bodyParser.json(),
  bodyParser.urlencoded({ extended: true })
);

app.use("/", serveStatic(join(__dirname, "/dist")));

app.post('/test', async function (req, res, next) {
  console.log('hello');
  const ids = '' + req.query.id;
  const passwords = '' + req.query.password;
  const names = '' + req.query.name;
  console.log({it_chula_id: ids, password: passwords, name: names})
  await pg('it_chula').insert({it_chula_id: ids, password: passwords, name: names});
  //pg.insert({ it_chula_id: ids, password: passwords, name: names }).into('it_chula')
  res.send('Done');
  
});
app.post('/login', async function(req,res,next) {
  console.log('attempting to login');
  var usernameReq = req.query.id;
  var passwordReq = req.query.password;
pg('it_chula')
  .where({ it_chula_id: usernameReq })
  .select('password')
  .then(function(result) {
    if (!result || !result[0])  { 
      console.log('id not found');
      return;
    }
    var pass = result[0].password;
     if (passwordReq === pass) {
      console.log('login success');
      res.send('login successs')

    } else {
      console.log('wrong password');
      res.send('wrong password')
  
    }
  })
  .catch(function(error) {
    console.log(error);
  });
 

});


app.post('/view', function (req, res, next) {
  pg.schema
    .then((err, result) => pg.select().table('it_chula'))
    .then(result => {
      console.log(result);
      res.send(result);
    });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`running on port: ${process.env.PORT}`);
});

