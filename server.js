const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'employee_db'
  },
  console.log(`Connected to the employee_db database.`)
);
const queryDb = (...args) => new Promise((resolve, reject) => {
    db.query(...args, (err, results) => {
        if (err) {
            reject(err)
        } else {
            resolve(results)
        }
    })
});

const showManagersQuery = `
SELECT manager_id, role_id, first_name, last_name, title
FROM employee
JOIN role
ON employee.role_id = role.id
AND manager_id = employee.id
GROUP BY manager_id;`

queryDb(showManagersQuery)
    .then(results => console.table(results))
    .catch(err => console.error(err))



