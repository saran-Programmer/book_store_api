var mysql = require('mysql');
require("dotenv").config()

var con = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER_NAME,
  password: process.env.PASSWORD
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});