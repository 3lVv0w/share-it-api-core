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
      res.send(pg('accounts').select(aid).where({it_chula:usernameReq}));

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
  var rimage = req.query.image+'';
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
       await pg('accounts').insert({tel_no:rtel_no,password:rpassword,first_name:rfirstname,last_name:rlastname,email:remail,qrcode:rqrcode,it_chula: rit_chula, image: rimage})
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

app.post('/borrowRequest',function(req,res,next){
  console.log('listing item onto request catalogue')
  var rnote = req.query.note+'';
  var ritem_name = req.query.item_name+'';
  var ritem_type = req.query.item_type+'';
  var rtoken_used = req.query.token_used+'';
  var rk_location = req.query.k_location+'';
  var rborrow_time = req.query.borrow_time+'';
  var rreturn_time = req.query.return_time +'';
  var rid = req.query.it_chula+'';
  //var rimage = req.query.image+''; add column
  pg('accounts')
  .where({it_chula:rid})
  .then(async function(result){
    await pg('request').insert({
      note:rnote,
      item_name:ritem_name,
      item_type:ritem_type,
      token_used:rtoken_used,
      k_location:rk_location,
      borrow_time:pg.fn.now(),
      return_time:pg.fn.now(),
      aid : pg('accounts').where({it_chula:rid}).select('aid'),
      l_status: 'true'
      //image : rimage; add column
    })
    res.send('added item into list');
  })
  //var image;
  //var id;
});

//refresh session page

app.post('/acceptRequest', async function(req,res,next){
  var rrid = req.query.rid +'';
  var raid = req.query.aid + '';
await  pg('request')
  .where({rid: rrid})
  .update('l_status','true');
await pg('accounts')
  .where({aid:raid})
  .update('in_session','true');
await pg('accounts')
  .where({aid : pg('request').select('aid').where({rid : rrid})})
  .update('in_session','true');
await pg('session')
  .insert({start_time : pg.fn.now(), end_time : pg.fn.now(), aid :raid, rid: rrid, s_status : 'go to kiosk', iid : 0 })
 await pg('accounts')
  .where({aid : pg('request').select('aid').where({rid : rrid})})
  .then(result =>{
    console.log(result);
    res.send(result);  })
  //update status in request
  //res.send() send borrower id
})

app.post('/checkAccept',async function(req,res,next){
  var rrid = req.query.rid +'';
  console.log('refresh');
  await pg('request')
  .where({rid:rrid,l_status:'true'})
  .then(async function (result){
    if(!result || !result[0]){
      res.send('false');
      console.log('false')
    }
    else{
      console.log('true');
      await pg('accounts').where({aid: pg('session').select('aid').where({rid: rrid})})
      .then(result=>{
        console.log(result);
        res.send(result);
      })
    }
  })

      //check if status in request has been changed
    //accept aid res if id in session send info of lender else send no session
})

  
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

