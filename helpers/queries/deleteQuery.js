const db = require("../../config/connection");
const {queryDb, queryDbSimplified} = require('./mysqlQuery');
const cTable = require('console.table');

class Delete {
    employee(conditionProp, conditionValue) {
        const deleteEmployeeQuery = `
        DELETE FROM employee
        where ${conditionProp} = ? 
        `
        return queryDbSimplified(deleteEmployeeQuery, conditionValue);
    };

    department(conditionValue) {
        const deleteDepartmentQuery = `
        DELETE FROM department
        WHERE name = ?
        `
        return queryDbSimplified(deleteDepartmentQuery, conditionValue);
    };

    role(conditionValue) {
        const deleteRolesQuery =`
        DELETE FROM role
        where title = ?
        `
        return queryDbSimplified(deleteRolesQuery, conditionValue);
    };
};

module.exports = Delete;