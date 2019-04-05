const morgan = require("morgan");
const app = require("express")();
const router = require("./routes/api");
const bodyParser = require("body-parser");
const { join } = require("path");
const serveStatic = require("serve-static");
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`running on port: ${PORT}`);
	
});
app.set("json spaces", 2);
app.use(morgan("dev"));
app.use(require("cors")());
app.use(bodyParser.json(), bodyParser.urlencoded({ extended: true }));
app.use("/", serveStatic(join(__dirname, "/dist")));
app.use("/api", router);
app.get("*", function(req, res) {
  res.sendFile(__dirname + "/dist/index.html");
});
