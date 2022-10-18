// NPMs
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

//Boilerplates 
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//MYSQL employee_db database connects upon starting server.js
const db = mysql.createConnection( 
  {
    host: 'localhost',
    user: process.env.USER,
    password: process.env.PASSWORD,
    //database: employee_db
    database: process.env.DATABASE,
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


const queryDbSimplified = (...args) => { 
    queryDb(...args)
    // `\n` added to avoid table rendering alongside confirm inquirer prompt
        .then(results => console.table(`\n`, results))
        .catch(err => console.error(err))
};

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

//View departments
const showDepartmentsQuery = `SELECT id, name FROM department`

const showRolesQuery = `SELECT id, title, salary, department_id FROM role`

const showEmployeesQuery = `SELECT id, first_name, last_name, role_id, manager_id FROM employee`

//Inquirer
const cmsInquirer = () => {
inquirer
    .prompt([
        {
            type: 'list',
            name: 'option',
            message: 'What would you like to do?',
            choices: ['View departments', 'View roles', 
                      'View employees', 'View managers', 'debug']
        }
    ]).then(answers => {
        switch (answers.option) {
             case "View departments":
                queryDbSimplified(showDepartmentsQuery);
                break;
             case "View roles":
                queryDbSimplified(showRolesQuery);
                break;
             case "View employees":
                queryDbSimplified(showEmployeesQuery);
                break;
            case "View managers":
                queryDbSimplified(showManagersQuery);
                break;
            default: 
                console.error("Oops something went wrong!\nLet's try that again.")
            }
        }).then(response => askAgain());
}


const askAgain = () => {
inquirer
    .prompt([
        {
            type: 'confirm',
            name: 'confirm',
            message: 'Would you like to continue using the CMS?\n'
        },
    ]).then((confirm) => {
        //if user types Yes
       if (confirm.confirm) {
           //Run cmsInquirer() again
           cmsInquirer()  
       } else {
       //else console.log this, and end node server.js 
       console.log("Thanks for using KangaZero's Employee Tracker CMS!\n See you next time!"); 
       process.exit();
       }
    })
}


//Runs inquirer upon starting server.js
cmsInquirer();


