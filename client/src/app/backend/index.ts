//create our server
import express from 'express';

//pass our json request
import bodyParser from 'body-parser';

import signUpRouter from "./routes/auth";
import loginRouter from "./routes/login-router";

import { Request, Response, NextFunction } from 'express';

import { errorController } from './controllers/error';

//create our application
//its gonna be an express method
const app = express();

//create a port
//SERVER OR LOCAL
const ports = process.env['PORT'] || 3000;

app.use(express.json());
app.use(bodyParser.json());

//allow access to different pages and operalization
app.use((req: Request, res: Response, next: NextFunction) => {
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

app.use('/auth', signUpRouter);
app.use('/', loginRouter);

if (errorController.get404) {
  app.use(errorController.get404);
}

if (errorController.get500) {
  app.use(errorController.get500);
}

//listen to the port
app.listen(ports, () => console.log(`Listening on port ${ports}`));
