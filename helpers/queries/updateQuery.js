const db = require("../../config/connection");
const {queryDb, queryDbSimplified} = require('./mysqlQuery');
const cTable = require('console.table');

class Update {
    employeeName(updateProp, conditionProp, conditionValue, updateValue) {
        const updateEmployeeNameQuery = `
        UPDATE employee AS e
        SET e.${updateProp} = ?
        WHERE e.${conditionProp} = '${parseInt(conditionValue)}'
        `
        return queryDbSimplified(updateEmployeeNameQuery, updateValue);
    };

    employeeDepartment(departmentId, conditionProp, conditionValue) {
        const updateEmployeeDepartmentQuery = `
        UPDATE employee AS e, role AS r
        SET r.department_id = ${parseInt(departmentId)}
        WHERE e.${conditionProp} = ? 
        AND e.role_id = r.id ;
        `
        return queryDbSimplified(updateEmployeeDepartmentQuery, conditionValue);
    };

    employeeSalary(conditionProp, conditionValue, updateValue) {
        const updateEmployeeSalaryQuery = `
        UPDATE employee as e, role as r
        SET r.salary = ?
        WHERE e.${conditionProp} = '${parseInt(conditionValue)}' 
        AND e.role_id = r.id
        `
        return queryDbSimplified(updateEmployeeSalaryQuery, updateValue);
    };

    employeeTitleToManager(conditionProp, conditionValue) {
        const toManagerQuery1 = `
        UPDATE employee as e, role as r
        SET e.manager_id = e.id
        WHERE e.${conditionProp} = ? 
        AND e.role_id = r.id;
        `
        const toManagerQuery2 =`
        UPDATE employee as e, role as r
        SET r.title = 'manager'
        WHERE e.${conditionProp} = ? AND e.role_id = r.id;
        `
        queryDbSimplified(toManagerQuery1, conditionValue)
        queryDbSimplified(toManagerQuery2, conditionValue)
        return;
    };

    employeeTitleToEmployee(conditionProp, conditionValue) {
        const toEmployeequery1 =`
        UPDATE employee as e, role as r
        SET e.manager_id = NULL
        WHERE e.${conditionProp} = ? AND e.role_id = r.id;
        `
        const toEmployeequery2 =`
        UPDATE employee as e, role as r
        SET r.title = 'employee'
        WHERE e.${conditionProp} = ? AND e.role_id = r.id;
        `
        queryDbSimplified(toEmployeequery1, conditionValue)
      const hi =  queryDbSimplified(toEmployeequery2, conditionValue)
      console.log(hi.affectedRows)
        return;
    };

};

module.exports = Update;