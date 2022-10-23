//npms
const db = require('./config/connection');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

//queries
const View = require('./helpers/queries/viewQuery');
const Update =require('./helpers/queries/updateQuery');
const Delete = require('./helpers/queries/deleteQuery');

//mysql query classes 
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
                                'Delete', 'Exit']
                    }
                ])
        if (answer.option == "View") {
            const viewOptions = async () => {
     try {
            const view = await inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'view',
                        message: "What would you like to view?",
                        choices: ["All", "Managers", "Employees", "Roles", "Departments", "Employees by Department", "Total Budget by Department", "Back", "Exit"]
                    }
                ])
                switch (view.view) {
                    case "Back":
                         return cmsInquirer();
                        break;
                    case "Exit":
                         console.log("Thanks for using KangaZero's Employee Tracker CMS!\n See you next time!"); 
                         return process.exit();
                        break;
                    case "All":
                         viewQuery.all();
                         return askAgain();
                        break;
                    case "Managers":
                         viewQuery.managers();
                         return askAgain();
                        break;
                    case "Employees":
                        viewQuery.employees();
                        return askAgain();
                        break;
                    case "Roles":
                         viewQuery.roles();
                         return askAgain();
                        break;
                    case "Departments":
                        viewQuery.departments();
                        return askAgain();
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
                         return askAgain();

                        } catch (err) {
                            console.error('Invalid department name')
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
                         return askAgain();

                        } catch (err) {
                            console.error('Invalid department name')
                        }
                        }
                        totalBudgetByDepartment();
                        break;
                    default:
                        console.error("Oops something went wrong!\nLet's try that again.")
                            } //end of switch statement for view
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
                            message: "Pick search term for employee to update",
                            choices: ['id', 'first_name', 'last_name', 'Back', 'Exit']
                        }
                ])
                if(employeeProp.employeeProp == "Back") {
                    return cmsInquirer();
                } else if (employeeProp.employeeProp == "Exit") {
                    console.log("Thanks for using KangaZero's Employee Tracker CMS!\n See you next time!"); 
                    process.exit();
                } else {
            const employeeValue = await inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'employeeValue',
                    message: `Enter employee's ${employeeProp.employeeProp} `
                }
            ])
            const isValid = viewQuery.isValidEmployee(employeeProp.employeeProp, employeeValue.employeeValue);
               //show the employee the user wishes to update
            const updateProp = await inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'updateProp',
                    message: 'What would you like to update for this employee?',
                    choices: ['first_name', 'last_name', 'salary', 'title', 'department']
                }
            ])
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
            } else if (updateProp.updateProp == "title") {
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
                    switch (updateTitleValue.updateTitleValue) {
                        case 'employee':
                            updateQuery.employeeTitleToEmployee(employeeProp.employeeProp, employeeValue.employeeValue)  
                        break;
                        case 'manager':
                            updateQuery.employeeTitleToManager(employeeProp.employeeProp, employeeValue.employeeValue)
                        break;
                        default:
                            console.error("Oops something went wrong!\nLet's try that again.")
                }
                 await askAgain();
               } catch (err) {
                   console.error(err);
                   await askAgain();
                } 
                }//end of updateTitle
                return updateTitle();
            } else if (updateProp.updateProp == "department") {
                const updateDepartment = async () => {
                    try{
                        const department = await inquirer
                        .prompt([
                            {
                                type: 'list',
                                name: 'department',
                                message: 'Choose the department to change for this employee',
                                choices: ['Telecommunications', 'Troubleshooting', 'Database', 'Security', 'Software']
                            }
                        ])
                            //Database ID number
                            const telecommunications = 1
                            const troubleshooting = 2
                            const database = 3 
                            const security = 4 
                            const software = 5
                        
                        switch(department.department) {
                            case 'Telecommunications':
                                updateQuery.employeeDepartment(telecommunications, employeeProp.employeeProp, employeeValue.employeeValue);
                            break;
                            case 'Troubleshooting':
                                updateQuery.employeeDepartment(troubleshooting, employeeProp.employeeProp, employeeValue.employeeValue);
                            break;
                            case 'Database':
                                updateQuery.employeeDepartment(database, employeeProp.employeeProp, employeeValue.employeeValue);
                            break;
                            case 'Security':
                                updateQuery.employeeDepartment(security, employeeProp.employeeProp, employeeValue.employeeValue);
                            break;
                            case 'Software':
                                updateQuery.employeeDepartment(software, employeeProp.employeeProp, employeeValue.employeeValue);
                            break;
                            default:
                                console.error("Database either does not exist or has been deleted")
                        }
                        await askAgain(); 
                    } catch (err) {
                        console.log(err);
                        await askAgain(); 
                    }
                }//end of updateDepartment
                return updateDepartment();
            }//end of if else updateProp.updateProp
                }
        } catch (err) {
            console.log(err);
            await askAgain();
        } //end of try & catch
    }; //end of updateOption();
        return updateOption();
        } else if (answer.option == "Delete") {
            const deleteOption = async () => {
                try {
                    const deleteProp = await inquirer
                        .prompt([
                            {
                                type: 'list',
                                name: 'deleteProp',
                                message: 'What would you like to delete?',
                                choices: ['Employee', 'Role', 'Department', 'Back', 'Exit']
                            }
                        ])

                            if (deleteProp.deleteProp == "Back") {
                                return cmsInquirer();
                            } else if (deleteProp.deleteProp == "Exit") {
                                console.log("Thanks for using KangaZero's Employee Tracker CMS!\n See you next time!"); 
                                process.exit();
                            } else if(deleteProp.deleteProp == "Employee") {
                            const deleteEmployee = async () => {
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
                        const employeeValue = await inquirer
                        .prompt([
                            {
                                type: 'input',
                                name: 'employeeValue',
                                message: `Enter employee's ${employeeProp.employeeProp} `
                            }
                        ])

                        const isValid = viewQuery.isValidEmployee(employeeProp.employeeProp, employeeValue.employeeValue);
                        const deleteConfirm = await inquirer
                            .prompt([
                                {   
                                    type: 'confirm',
                                    name: 'deleteConfirm',
                                    message: 'Are you sure you want to delete this employee?'
                                }
                            ]);

                            deleteConfirm.deleteConfirm ?
                             deleteQuery.employee(employeeProp.employeeProp, employeeValue.employeeValue) : askAgain();
                             return askAgain();
                                } catch (err) {
                                    console.error(err);
                                }
                            }; //end of deleteEmployee
                            deleteEmployee();
                            } else if (deleteProp.deleteProp == "Role" ){
                            const deleteRole = async () => {
                                try {
                                    const roleProp = await inquirer
                                    .prompt([
                                        {
                                            type: 'list',
                                            name: 'roleProp',
                                            message: "Pick which role to delete",
                                            choices: ['employee', 'manager']
                                        }
                                    ]);
                                         deleteQuery.role(roleProp.roleProp)
                                         console.log(`${roleProp.roleProp} role deleted`)
                                         return askAgain();
                                } catch (err) {
                                    console.log(err);
                                };
                            }
                            return deleteRole();
                            } else if (deleteProp.deleteProp == "Department") {
                                const deleteDepartment = async () => {
                                    try {
                                        const departmentValue = await inquirer
                                        .prompt([
                                            {
                                                type: 'list',
                                                name: 'departmentValue',
                                                message: 'Which department would you like to delete?',
                                                choices: ['Telecommunications', 'Troubleshooting', 'Database', 'Security', 'Software']
                                            }
                                        ]);
                                        deleteQuery.department(departmentValue.departmentValue);
                                        console.log(`${departmentValue.departmentValue} deparment deleted`);
                                        return askAgain();
                                    } catch (err) {
                                        console.error(err);
                                    }
                                };
                                return deleteDepartment();
                            } else {
                                console.log("Error!")
                                await askAgain();
                            }
                        }  catch (err) {
                console.error(err);
                await askAgain();
                };
            };
        return deleteOption();
        } else { //exit option
            console.log("Thanks for using KangaZero's Employee Tracker CMS!\n See you next time!"); 
            process.exit();
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