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
  res.send(200);
})

app.listen(process.env.PORT || 3000, () => {
  console.log(`running on port: ${PORT}`);
});