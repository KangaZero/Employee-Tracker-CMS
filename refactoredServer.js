const db = require('./config/connection');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

//queries
const View = require('./helpers/queries/viewQuery');
const Update =require('./helpers/queries/updateQuery');
const Delete = require('./helpers/queries/deleteQuery');

const viewQuery = new View;
const updateQuery = new Update;
const deleteQuery = new Delete;

const cmsInquirer = async () => {
    try {
            const answer = await inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'option',
                        message: 'What would you like to do?',
                        choices: ['View', 'Update Employee', 
                                'Delete', 'Search', 'debug', 'Exit']
                    }
                ])
         //TODO delete once debug done
        console.log(answer)
        if (answer.option == "View") {
            const viewOptions = async () => {
     try {
            const view = await inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'view',
                        message: "What would you like to view?",
                        choices: ["All", "Managers", "Employees", "Roles", "Departments", "Employees by Department", "Total Budget by Department"]
                    }
                ])
                switch (view.view) {
                    case "All":
                         viewQuery.all();
                        break;
                    case "Managers":
                         viewQuery.managers();
                        break;
                    case "Employees":
                         viewQuery.employees();
                        break;
                    case "Roles":
                         viewQuery.roles();
                        break;
                    case "Departments":
                        viewQuery.departments();
                        break;
                    case "Employees by Department":
                            const employeesByDepartment = async () => {
                        try {
                            const departmentView = await inquirer
                                    .prompt([{
                                        type: 'list',
                                        name: 'departmentView',
                                        message: "Which department of employees do you want to view from?",
                                        choices: ["Telecommunications", "Troubleshooting", "Database", "Security", "Software"]
                                    }
                                ])
                                viewQuery.employeesbyDepartment(departmentView.departmentView);
                        } catch (err) {
                            res.status(400).json('Invalid department name')
                        }
                    }
                        employeesByDepartment();
                        break;
                    case "Total Budget by Department":
                            const totalBudgetByDepartment = async () => {
                        try {
                            const budgetView = await inquirer
                                .prompt([
                                    {
                                    type: 'list',
                                    name: 'budgetView',
                                    message: "Which department do you want to view the total budget from?",
                                    choices: ["Telecommunications", "Troubleshooting", "Database", "Security", "Software"]
                                    }
                            ])
                            viewQuery.totalBudgetByDepartment(budgetView.budgetView);

                        } catch (err) {
                            res.status(400).json('Invalid department name')
                        }
                        }
                        totalBudgetByDepartment();
                        break;
                            }
                        
                }
             catch (err) {
                res.status(400).json('Invalid view name')
            }
            }
            return viewOptions();
        }
    } catch (err){
        console.log(err)
    }
};

cmsInquirer();