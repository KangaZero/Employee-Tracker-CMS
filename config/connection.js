const mysql = require('mysql2');
//dotenv not working on this folder
require('dotenv').config();

//MYSQL employee_db database connects upon starting server.js
const db = mysql.createConnection( 
    {
      host: 'localhost',
      user: 'root' || process.env.ROOT,
      password: '12345' || process.env.PASSWORD,
      //database: employee_db
      database: 'employee_db' || process.env.DATABASE,
    },
    console.log(`Connected to the employee_db database.`)
  );


  module.exports = db; 