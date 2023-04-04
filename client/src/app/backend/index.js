//create our server
const express = require('express');

//pass our json request
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');

const errorController = require('./controllers/error');

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
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Accept, X-Custom-Header, Authorization'
  );
  next();
});

app.use('/auth', authRoutes);

app.use(errorController.get404);

app.use(errorController.get500);

console.log("here1")
//listen to the port
app.listen(ports, () => console.log(`Listening on port ${ports}`));
