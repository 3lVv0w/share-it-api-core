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

app.post('/insertRegChula', async function (req, res, next) {
  console.log('inserting user');
  const rid = '' + req.query.id;
  const rfirstname = '' + req.query.firstname;
  const rlastname = '' + req.query.lastname;
  console.log('entering id into temp_it_chula')
  await pg('temp_it_chula').insert({it_chula: rid, first_name: rfirstname, last_name: rlastname});
  res.send('Done'); 
});

app.post('/login', async function(req,res,next) {
  console.log('attempting to login');
  var usernameReq = req.query.id+'';
  var passwordReq = req.query.password+'';
pg('accounts')
  .where({ it_chula: usernameReq })
  .select('password')
  .then(function(result) {
    if (!result || !result[0])  { 
      console.log('id not found');
      return;
    }
    var pass = result[0].password;
     if (passwordReq === pass) {
      console.log(usernameReq+ ' login success');
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

app.post('/signup',async function(req,res,next){
  console.log('attempt to signup');
  var rtel_no = req.query.tel_no+'';
  var rpassword = req.query.password+'';
  var rfirstname =req.query.firstname+'';
  var rlastname = req.query.lastname+'';
  var remail = req.query.email+'';
  var rit_chula = req.query.it_chula+'';
  var rqrcode = rit_chula + rfirstname;
  //var checked_it_chula;
  pg('temp_it_chula')
  .where({it_chula:rit_chula,first_name:rfirstname,last_name:rlastname})
  .then(async function(result){
  if(!result || !result[0]){
      console.log('entered wrong id')
      res.send('entered wrong id')
  } else{
    pg('accounts')
   .where({it_chula:rit_chula}) 
   .then(async function(result){
    if (!result || !result[0])  { 
       await pg('accounts').insert({tel_no:rtel_no,password:rpassword,first_name:rfirstname,last_name:rlastname,email:remail,qrcode:rqrcode,it_chula: rit_chula})
       console.log('added info of ' + rit_chula + ' into accounts')
    } else 
    console.log('sorry your account has been already registered')
    res.send('sorry your account has been already registered')
    });
  }
  })
});

app.get('/iotchecknameid',function (req, res, next) {
  var rqrcode = req.query.qrcode+'';
  pg('accounts')
  .where({qrcode : rqrcode})
  .then(async function(result){
  if(!result || !result[0]){
      console.log('fake qr')
      res.send('entered wrong qr')
  } else{
    pg('accounts')
   .where({qrcode : rqrcode}).select('first_name','it_chula' ) 
   .then(result =>{
     console.log(result);
     res.send(result);  })
  }
})
});  



app.post('/inseritem', async function (req, res, next) {
  console.log('inserting item');
  const name = '' + req.query.name;
  const type = '' + req.query.type;
  const id = '' + req.query.id;
  var qr = '';
  pg.schema
  .then((err, result) => pg('accounts').where({it_chula : id}).select('aid','qrcode'))
  .then(async (result) => {
    await pg('items').insert({item_name: name, item_type: type, item_qrcode: result[0].qrcode, belonged_aid: result[0].aid});
    qr = result[0].qrcode;
    console.log(qr+' is the qrcode');
  })
  pg.schema
  .then((err, result) => pg('items').where({item_qrcode : qr}).select('iid'))
  .then(async (result) => {
    console.log(result)
    await pg('items')
    .where('qrcode = '+qr)
    .update({
      item_qrcode:qr+ result[0].iid
    })
  })
});


app.get('/view', function (req, res, next) {
  pg.schema
    .then((err, result) => pg.select().table('items'))
    .then(result => {
      console.log(result);
      res.send(result);
    });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`running on port: ${process.env.PORT}`);
});

