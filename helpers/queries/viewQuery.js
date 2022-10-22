const db = require("../../config/connection");
const {queryDb, queryDbSimplified} = require('./mysqlQuery');
const cTable = require('console.table');
const { json } = require("express");

class View {
    all() {
        const viewAllQuery = `
        SELECT *
        FROM employee
        JOIN role
        ON employee.role_id = role.id
        JOIN department
        ON role.department_id = department.id
        `
        return queryDbSimplified(viewAllQuery);
    };

    managers() {
        const viewManagersQuery = `
        SELECT manager_id, role_id, first_name, last_name, title
        FROM employee
        JOIN role
        ON employee.role_id = role.id
        AND manager_id = employee.id
        GROUP BY manager_id
        `
        return queryDbSimplified(viewManagersQuery);
    };

    departments() {
        const viewDepartmentsQuery = `
        SELECT id, name 
        FROM department
        `
        
        return queryDbSimplified(viewDepartmentsQuery);
    };

    roles() {
        const viewRolesQuery = `
        SELECT id, title, salary, department_id 
        FROM role
        `
        return queryDbSimplified(viewRolesQuery);
    };

    employees() {
        const viewEmployeesQuery = `
        SELECT id, first_name, last_name, role_id, manager_id 
        FROM employee
        `

        return queryDbSimplified(viewEmployeesQuery);
    };

    totalBudgetByDepartment(conditionValue) {
        const viewTotalBudgetbyDeparmentQuery = `
        SELECT name as department, sum(salary) AS total_budget
        FROM role
        JOIN department
        ON role.department_id = department.id
        AND department.name = ?
        `
        return queryDbSimplified(viewTotalBudgetbyDeparmentQuery, conditionValue);
    };

    employeesbyDepartment(conditionValue) {
        const viewEmployeesByDepartmentQuery = `
        SELECT role_id as id, first_name, last_name, title, name as department
        FROM employee 
        JOIN role
        ON employee.role_id = role.id
        JOIN department
        ON role.department_id = department.id
        AND department.name = ?
        `
        return queryDbSimplified(viewEmployeesByDepartmentQuery, conditionValue);
    };

    isValidEmployee(conditionProp, conditionValue) {
        const isValidEmployeeQuery = (conditionProp) => `
        SELECT * 
        FROM employee
        JOIN role
        ON employee.role_id = role.id
        JOIN department
        ON role.department_id = department.id
        where employee.${conditionProp} = ?
        `
        queryDbSimplified(isValidEmployeeQuery(conditionProp), conditionValue);
    };

    test(conditionProp, conditionValue) {
        const isValidEmployeeQuery = (conditionProp) => `
        SELECT * 
        FROM employee
        JOIN role
        ON employee.role_id = role.id
        JOIN department
        ON role.department_id = department.id
        where employee.${conditionProp} = ?
        `
        db.query(isValidEmployeeQuery(conditionProp), conditionValue, (err, results) => {
            if (err) {
                console.log(err)
            } else {
                console.log(results)
            }
        })
    }
};

const test = new View;
isTrue = () =>{
    const isValid =test.test('id', 1)
   console.log(typeof(isValid))
}
// isTrue()
// test.isValidEmployee('id', 1)
//test.test('id', 124)

module.exports = View; 