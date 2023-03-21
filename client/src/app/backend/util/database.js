//config -> config.js is database configuration
const mysql = require("mysql2");

//this is separated so u can git ignore the config file
const config = require("../config/config.json");

//create a creation port to which we constanlty listen to requests from sql and node
const pool = mysql.createPool({
  host: config.host,
  user: config.user,
  database: config.database,
  password: config.password,
});

module.export = pool.promise();
