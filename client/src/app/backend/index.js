//create our server
const express = require("express");

//pass our json request
const bodyParser = require("body-parser");

//create our application
//its gonna be an express method
const app = express();

//create a port
//SERVER OR LOCAL
const ports = process.env.PORT || 3000;

app.use(bodyParser.json());

//allow access to different pages and operalization
app.use((req, res, next) => {
  //any location can request thru API
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET", "POST", "PUT", "DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type",
    "Authorization"
  );
  next();
});
//listen to the port
app.listen(ports, () => console.log(`Listening on port ${ports}`));
