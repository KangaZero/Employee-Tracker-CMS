// NPMs
const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

//Boilerplates 
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//MYSQL employee_db database connected
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'employee_db'
  },
  console.log(`Connected to the employee_db database.`)
);

//Promise function to callback a MYSQL query
const queryDb = (...args) => new Promise((resolve, reject) => {
    db.query(...args, (err, results) => {
        if (err) {
            reject(err)
        } else {
            resolve(results)
        }
    })
});

//TODO add queries for View employees by department, 
//TODO Update employee managers, 
//TODO Delete departments, roles, and employees., 
//TODO View the total utilized budget of a department—in other words, the combined salaries of all employees in that department.

//VIEW employee by managers
const showManagersQuery = `
SELECT manager_id, role_id, first_name, last_name, title
FROM employee
JOIN role
ON employee.role_id = role.id
AND manager_id = employee.id
GROUP BY manager_id;`





//Inquirer
const CmsInquirer = () => {
inquirer
    .prompt([
        {
            type: 'list',
            name: 'option',
            message: 'What would you like to do?',
            choices: ['View managers']
        }
    ]).then(answers => {
        // console.log(answers.option)
        switch (answers.option) {
            case "View managers":
                queryDb(showManagersQuery)
                    .then(results => console.table(results))
                    .catch(err => console.error(err))
                break;
            default: 
                console.error("Oops something went wrong!\nLet's try that again.")
                .then(CmsInquirer());
        }
    });
}   

CmsInquirer();