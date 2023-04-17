//config -> config.js is database configuration
import mysql from 'mysql2/promise';

//this is separated so u can git ignore the config file
import config from '../config/config.json';

//create a creation port to which we constanlty listen to requests from sql and node
const pool = mysql.createPool({
  host: config.host,
  user: config.user,
  database: config.database,
  password: config.password,
});

export default pool;
