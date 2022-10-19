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
// const updateEmployeeLNameQuery =  `
// UPDATE employee
// SET last_name = ?
// where id = ? OR first_name = ? OR last_name = ?
// `

// const updateEmployeeFNameQuery = `
// UPDATE employee
// SET first_name = ?
// where id = ? OR first_name = ? OR last_name = ?
// `
//works
const updateEmployeeNameQuery = (updateProp, conditionProp, value) => `
UPDATE employee AS e
SET e.${updateProp} = ?
WHERE e.${conditionProp} = '${parseInt(value)}'
`

//update by first_name || last_name || id
const updateEmployeeDepartment = (id, conditionProp) => `
UPDATE employee AS e, role AS r
SET r.department_id = ${id}
WHERE e.${conditionProp} = ? AND e.role_id = r.id ;
`
//works
const updateEmployeeSalary = (conditionProp, value) => `
UPDATE employee as e, role as r
SET r.salary = ?
WHERE e.${conditionProp} = '${parseInt(value)}' AND e.role_id = r.id
`

// const updateEmployeeTitleToManager = (conditionProp) => `
// UPDATE employee as e, role as r
// SET e.manager_id = e.id
// WHERE e.${conditionProp} = ? AND e.role_id = r.id;
// UPDATE employee as e, role as r
// SET r.title = 'manager'
// WHERE e.${conditionProp} = ? AND e.role_id = r.id;
// `
const updateEmployeeTitleToManager1 = (conditionProp) => `
UPDATE employee as e, role as r
SET e.manager_id = e.id
WHERE e.${conditionProp} = ? AND e.role_id = r.id;
`

const updateEmployeeTitleToManager2 = (conditionProp) =>`
UPDATE employee as e, role as r
SET r.title = 'manager'
WHERE e.${conditionProp} = ? AND e.role_id = r.id;
`

const updateEmployeeTitleToEmployee1 = (conditionProp) => `
UPDATE employee as e, role as r
SET e.manager_id = NULL
WHERE e.${conditionProp} = ? AND e.role_id = r.id;
`
const updateEmployeeTitleToEmployee2 = (conditionProp) =>`
UPDATE employee as e, role as r
SET r.title = 'employee'
WHERE e.${conditionProp} = ? AND e.role_id = r.id;
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
SELECT name as department, sum(salary) AS total_budget
FROM role
JOIN department
ON role.department_id = department.id
AND department.name = ?
`

//works
const showEmployeesByDepartmentQuery = `
SELECT role_id as id, first_name, last_name, title, name as department
FROM employee 
JOIN role
ON employee.role_id = role.id
JOIN department
ON role.department_id = department.id
AND department.name = ?
`

const isValidEmployeeQuery = (query) => `
SELECT * 
FROM employee
where ${query} = ?
`
//Inquirer
const cmsInquirer = () => {
inquirer
    .prompt([
        {
            type: 'list',
            name: 'option',
            message: 'What would you like to do?',
            choices: ['View', 'Update Employee', 
                      'Delete', 'Search', 'debug', 'Exit']
        }
    ]).then(answer => {
          //TODO delete once debug done
        console.log(answer)
        if (answer.option == "View") {
            const viewOptions = () => { 
inquirer
    .prompt([
        {
            type: 'list',
            name: 'view',
            message: "What would you like to view?",
            choices: ["All", "Managers", "Employees", "Roles", "Departments", "Employees by Department", "Total Budget by Department"]
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
            const employeesByDepartment = () => {
                inquirer
                    .prompt([{
                        type: 'list',
                        name: 'departmentView',
                        message: "Which department of employees do you want to view from?",
                        choices: ["Telecommunications", "Troubleshooting", "Database", "Security", "Software"]
                    }
                ]).then(departmentView => {
                            queryDbSimplified(showEmployeesByDepartmentQuery, departmentView.departmentView)
                    }).then(response => askAgain());
                };
            employeesByDepartment();
            break;
        case "Total Budget by Department":
            const totalBudgetByDepartment = () => {
                inquirer
                    .prompt([{
                        type: 'list',
                        name: 'budgetView',
                        message: "Which department do you want to view the total budget from?",
                        choices: ["Telecommunications", "Troubleshooting", "Database", "Security", "Software"]
                    }
                ]).then(budgetView => {
                        queryDbSimplified(showTotalBudgetbyDeparmentQuery, budgetView.budgetView)
                }).then(response => askAgain());
            };
            totalBudgetByDepartment();
            break;
        default: 
            console.error("Oops something went wrong!\nLet's try that again.")
            };
       }).then(response => askAgain());
    }
    viewOptions();
        }
        else if (answer.option == "Update Employee") {
            const updateOptions = () => {
inquirer
    .prompt([
        {
            type: 'list',
            name: 'employeeProp',
            message: "Pick search term for employee",
            choices: ['id', 'first_name', 'last_name']
        }
    ]).then(choice => {
        console.log(choice.employeeProp)
inquirer
    .prompt([
        {
            type: 'input',
            name: 'employeeValue',
            message: `Enter employee's ${choice.employeeProp} `
        }
    ]).then(input => {
          //TODO delete once debug done
        console.log(input.employeeValue)
         const isValidEmployee = queryDbSimplified(isValidEmployeeQuery(choice.employeeProp), input.employeeValue)
        // if(isValidEmployee) {
             console.table(isValidEmployee)
inquirer
    .prompt([
        {
            type: 'list',
            name: 'updateQuery',
            message: 'What would you like to update for this employee?',
            choices: ['first_name', 'last_name', 'salary', 'title', 'department']
        }
    ]).then(updateQuery => {
       //TODO delete once debug done
        console.log(updateQuery)
        if (updateQuery.updateQuery == 'first_name' || updateQuery.updateQuery == 'last_name' || updateQuery.updateQuery == 'salary') {
        const updateNameOrSalary = () => {
            inquirer
    .prompt([
        {
            type:'input',
            name:'updateValue',
            message: `Input change for employee's ${updateQuery.updateQuery}`
        }
    ]).then(updateValue => {
        //TODO delete once debug done
        console.log(updateValue)
        switch (updateQuery.updateQuery) {
                    case 'first_name': case 'last_name': 
                        queryDbSimplified(updateEmployeeNameQuery(updateQuery.updateQuery, choice.employeeProp, input.employeeValue), updateValue.updateValue)
                    break;
                    case 'salary':
                        queryDbSimplified(updateEmployeeSalary(choice.employeeProp, input.employeeValue), updateValue.updateValue)
                    break;
                    default:
                        console.error("Oops something went wrong!\nLet's try that again.")
                }
    })
        }
        updateNameOrSalary();
} else if (updateQuery.updateQuery == 'title') {
inquirer
    .prompt([
        {
            type: 'list',
            name: 'updateTitle',
            message: 'Choose the title to change for this employee',
            choices: ['employee', 'manager']
        }
    ]).then(updateTitle => {
            //TODO delete once debug done
        console.log(updateTitle)
        switch (updateTitle.updateTitle) {
            case 'employee':
                queryDbSimplified(updateEmployeeTitleToEmployee1(choice.employeeProp),input.employeeValue)   
                queryDbSimplified(updateEmployeeTitleToEmployee2(choice.employeeProp),input.employeeValue)   
            break;
            case 'manager':
                queryDbSimplified(updateEmployeeTitleToManager1(choice.employeeProp),input.employeeValue)   
                queryDbSimplified(updateEmployeeTitleToManager2(choice.employeeProp),input.employeeValue)   
            break;
            default:
                console.error("Oops something went wrong!\nLet's try that again.")
        }
    }) 
} else if (updateQuery.updateQuery === 'department') {
 inquirer
    .prompt([
        {
            type: 'list',
            name: 'updateDepartment',
            message: 'Choose the department to change for this employee',
            choices: ['Telecommunications', 'Troubleshooting', 'Database', 'Security', 'Software']
        }
    ]).then(updateDepartment => {
        //Database ID number
            const telecommunications = 1
            const troubleshooting = 2
            const database = 3 
            const security = 4 
            const software = 5
        switch (updateDepartment.updateDepartment) {
            case 'Telecommunications':
                queryDbSimplified(updateEmployeeDepartment(telecommunications, choice.employeeProp), input.employeeValue)
            break;
            case 'Troubleshooting':
                queryDbSimplified(updateEmployeeDepartment(troubleshooting, choice.employeeProp), input.employeeValue)
            break;
            case 'Database':
                queryDbSimplified(updateEmployeeDepartment(database, choice.employeeProp), input.employeeValue)
            break;
            case 'Security':
                queryDbSimplified(updateEmployeeDepartment(security, choice.employeeProp), input.employeeValue)
            break;
            case 'Software':
                queryDbSimplified(updateEmployeeDepartment(software, choice.employeeProp), input.employeeValue)
            break;
            default:
                console.error("Database either does not exist or has been deleted")
        }

    })
} else {
    console.error("Oops something went wrong!\nLet's try that again.")
}
    })

     //   } 
    })
   });
};
    updateOptions();
        }
     else{
        console.log("add Update Delete Search debug Exit'")
     }
        })
        // .then(response => askAgain());
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


