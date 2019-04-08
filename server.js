'use strict';

require('dotenv').config();
const morgan = require("morgan");
const app = require("express");
//const router = require("./routes/api");
const bodyParser = require("body-parser");
const { join } = require("path");
const serveStatic = require("serve-static");

app.set("json spaces", 2);
app.use(morgan("dev"));
app.use(require("cors")());

app.use(
  bodyParser.json(),
  bodyParser.urlencoded({ extended: true })
);

app.use("/", serveStatic(join(__dirname, "/dist")));

app.post('/test', function(req, res, next) {
  console.log('hello');
  const ids =''+req.query.id;
  const passwords ='' +req.query.password
  const names ='' +req.query.name;

  console.log(knex);

  knex.schema.then(function(err,result) {
       knex.insert({it_chula_id : ids , password :passwords, name  : names}).into('it_chula');
  })
  res.send(200);
})

app.post('/view', function (req, res, next) {
  knex.schema.then(function (err, result) {
    return knex.select().table('it_chula')
  })
  console.log(result);
  res.send(result);
})

app.listen(process.env.PORT || 3000, () => {
  console.log(`running on port: ${PORT}`);
});
