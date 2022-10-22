const db = require('./config/connection');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const tty = require('tty');

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
                    default:
                        console.error("Oops something went wrong!\nLet's try that again.")
                            };
                            await askAgain();
                        }
                        catch (err) {
                            res.status(400).json('Invalid view name')
                            await askAgain();
                        }
            }
            return viewOptions();
        } else if (answer.option == "Update Employee") {
            const updateOption = async () => {
                try { 
              const employeeProp = await inquirer
                    .prompt([
                        {
                            type: 'list',
                            name: 'employeeProp',
                            message: "Pick search term for employee",
                            choices: ['id', 'first_name', 'last_name']
                        }
                ])
         //TODO delete once debug done
                console.log(employeeProp)
            const employeeValue = await inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'employeeValue',
                    message: `Enter employee's ${employeeProp.employeeProp} `
                }
            ])
            //TODO delete once debug done
            console.log(employeeValue)
            const isValid = viewQuery.isValidEmployee(employeeProp.employeeProp, employeeValue.employeeValue);
            //TODO get boolean from isValid
            //if (console.log(isValid)) {
               console.log(isValid)
            const updateProp = await inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'updateProp',
                    message: 'What would you like to update for this employee?',
                    choices: ['first_name', 'last_name', 'salary', 'title', 'department']
                }
            ])
            console.log(updateProp)
            if (updateProp.updateProp == 'first_name' || updateProp.updateProp == 'last_name' || updateProp.updateProp == 'salary') {
                const updateNameOrSalary = async () => {
                try {
                    const updateValue = await inquirer
                    .prompt([
                        {
                            type:'input',
                            name:'updateValue',
                            message: `Input change for employee's ${updateProp.updateProp}`
                        }
                    ])
                    //TODO delete once debug done
                    console.log(updateValue)
                    switch (updateProp.updateProp) {
                        case "first_name": case "last_name":
                            updateQuery.employeeName(updateProp.updateProp, employeeProp.employeeProp, employeeValue.employeeValue, updateValue.updateValue)
                            break;
                            case 'salary':
                                updateQuery.employeeSalary(employeeProp.employeeProp, employeeValue.employeeValue, updateValue.updateValue)
                            break;
                            default:
                                console.error("Oops something went wrong!\nLet's try that again.")
                    }
                    await askAgain(); 
                } catch (err) {
                    console.log(err);
                    await askAgain(); 
                }    
                }
                return updateNameOrSalary();
            } else if (updateProp.updateProp = "title") {
                const updateTitle = async () => {
                try {
                    const updateTitleValue = await inquirer
                    .prompt([
                        {
                            type: 'list',
                            name: 'updateTitleValue',
                            message: 'Choose the title to change for this employee',
                            choices: ['employee', 'manager']
                        }
                    ])
                    //TODO delete once debug done
                    console.log(updateTitleValue)
                    switch (updateTitleValue.updateTitleValue) {
                        case 'employee':
                            updateQuery.employeeTitleToEmployee(employeeProp.employeeProp, employeeValue.employeeValue)  
                        break;
                        case 'manager':
                            updateQuery.employeeTitleToManager(employeeProp.employeeProp, employeeValue.employeeValue)  
                        break;
                        default:
                            console.error("Oops something went wrong!\nLet's try that again.")
                } await askAgain();
               } catch (err) {
                   console.error(err);
                   await askAgain();
                } 
                }
                return updateTitle();
            } else if (updateProp.updateProp = "department") {
                
            }
          //  } else  {
           //     console.error("Invalid input")
           // }
        } catch (err) {
            console.log(err);
            await askAgain();
        } //end of try & catch
        
    }; //end of updateOption();
        return updateOption();
        }
       
    } catch (err) {
        console.log(err);
    }
};

cmsInquirer();

const askAgain = async () => {
    try {
   const confirm = await inquirer
        .prompt([
            {
                type: 'confirm',
                name: 'confirm',
                message: 'Would you like to continue using the CMS?\n'
            },
        ])
        if (confirm.confirm) {
            return cmsInquirer();
        } else {
            console.log("Thanks for using KangaZero's Employee Tracker CMS!\n See you next time!"); 
            process.exit();
        }
    } catch (err) {
        console.error(err);
    };
    };