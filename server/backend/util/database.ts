//config -> config.js is database configuration
import * as mysql from 'mysql2/promise.js';

//this is separated so u can git ignore the config file
import * as config from '../config/config.json';

//create a creation port to which we constanlty listen to requests from sql and node
const db = mysql.createPool({
  host: config.host,
  user: config.user,
  database: config.database,
  password: config.password,
});

export default db;
