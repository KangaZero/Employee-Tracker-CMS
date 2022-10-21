const db = require("../../config/connection");
const {queryDb, queryDbSimplified} = require('./mysqlQuery');
const cTable = require('console.table');

class Delete {
    employee(conditionProp, conditionValue) {
        const deleteEmployeeQuery = `
        DELETE FROM employees
        where ${conditionProp} = ? 
        `
        return queryDbSimplified(deleteEmployeeQuery, conditionValue);
    };

    department(conditionProp, conditionValue) {
        const deleteDepartmentQuery = `
        DELETE FROM roles
        WHERE ${conditionProp} = ?
        `
        return queryDbSimplified(deleteDepartmentQuery, conditionValue);
    };

    role(conditionProp, conditionValue) {
        const deleteRolesQuery =`
        DELETE FROM roles
        where ${conditionProp} = ?
        `
        return queryDbSimplified(deleteRolesQuery, conditionValue);
    };
};

module.exports = Delete;