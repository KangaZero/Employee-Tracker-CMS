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


//Update Queries 
const updateEmployeeLNameQuery =  `
UPDATE employee
SET last_name = ?
where id = ? OR first_name = ? OR last_name = ?
`

const updateEmployeeFNameQuery = `
UPDATE employee
SET first_name = ?
where id = ? OR first_name = ? OR last_name = ?
`
//Database ID number
const telecommunications = 1
const troubleshooting = 2
const database = 3 
const security = 4 
const software = 5

//update by first_name || last_name || id
const updateEmployeeDepartment = `
UPDATE employee as e, role as r
SET r.department_id = ${telecommunications}
WHERE e.first_name= ? OR e.last_name = ?  OR e.id = ? AND e.role_id = r.id ;
`

//Delete Queries
const deleteEmployeeQuery = `
DELETE FROM employees
where id = ? OR first_name = ? OR last_name = ?
`

const deleteRolesQuery = `
DELETE FROM roles
where id = ?
`

const deleteDepartmentsQuery = `
DELETE FROM department
WHERE id = ? or name = ?
`

//VIEW employee by managers
const showManagersQuery = `
SELECT manager_id, role_id, first_name, last_name, title
FROM employee
JOIN role
ON employee.role_id = role.id
AND manager_id = employee.id
GROUP BY manager_id
`
//View all
const showAllQuery = `
SELECT *
FROM employee
JOIN role
ON employee.role_id = role.id
JOIN department
ON role.department_id = department.id
`

//View departments
const showDepartmentsQuery = `SELECT id, name FROM department`

//View roles
const showRolesQuery = `SELECT id, title, salary, department_id FROM role`

//View Employees
const showEmployeesQuery = `SELECT id, first_name, last_name, role_id, manager_id FROM employee`

//works
const showTotalBudgetbyDeparmentQuery = `
SELECT name as department, sum(salary) as total_budget
from role
join department
ON role.department_id = department.id
AND department.name = ?
`
//works
const showEmployeesByDepartmentQuery = (departmentName) => `
SELECT role_id as id, first_name, last_name, title, name as department
FROM employee 
JOIN role
ON employee.role_id = role.id
JOIN department
ON role.department_id = department.id
AND department.name = ${departmentName}
`

//Inquirer
const cmsInquirer = () => {
inquirer
    .prompt([
        {
            type: 'list',
            name: 'option',
            message: 'What would you like to do?',
            choices: ['View', 'Update', 
                      'Delete', 'Search', 'debug', 'Exit']
        }
    ]).then(answer => {
        if (answer.option = "View") {
            viewOptions();
            const viewOptions = () => { 
inquirer
    .prompt([
        {
            type: 'list',
            name: 'view',
            message: "What would you like to view?",
            choices: ["All", "Managers", "Employees", "Roles", "Departments, Employees by Department"]
        }
    ]).then(view => { 
        switch (view.view) {
        case "All":
            queryDbSimplified(showAllQuery);
            break;
        case "Managers":
            queryDbSimplified(showManagersQuery);
            break;
        case "Employees":
            queryDbSimplified(showEmployeesQuery);
            break;
        case "Roles":
            queryDbSimplified(showRolesQuery);
            break;
        case "Departments":
           queryDbSimplified(showDepartmentsQuery);
           break;
        case "Employees by Department":
            employeesByDepartment();
            const employeesByDepartment = () => {
                inquirer
                    .prompt([{
                        type: 'list',
                        name: 'departmentView',
                        message: "Which department of employees do you want to view from?",
                        choices: ["Telecommunications", "Troubleshooting", "Database", "Security", "Software"]
                    }
                ]).then(departmentView => {
                            queryDbSimplified(showEmployeesByDepartmentQuery(departmentView.departmentView))
                    });
                };
            break;
        default: 
            console.error("Oops something went wrong!\nLet's try that again.")
            };
       })
    }
        
       
        }
     else{}
        }).then(response => askAgain());
};


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
       //else console.log this, and end node server.js (eg. CTRL + C)
       console.log("Thanks for using KangaZero's Employee Tracker CMS!\n See you next time!"); 
       process.exit();
       //Anything after process.exit() will not run as terminal is exited
       }
    })
}


//Runs inquirer upon starting server.js
cmsInquirer();

