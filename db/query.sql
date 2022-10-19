-- Update employee managers.

-- View employees by manager.

-- View employees by department.

-- Delete departments, roles, and employees.

-- View the total utilized budget of a department—in other words, the combined salaries of all employees in that department.

select manager_id, role_id, first_name, last_name, title
from employee
join role
on employee.role_id = role.id
and manager_id = employee.id
group by manager_id;

-- const showEmployeesByDepartmentQuery 
SELECT role_id as id, first_name, last_name, title, name as department
FROM employee 
JOIN role
ON employee.role_id = role.id
JOIN department
ON role.department_id = department.id
AND department.name = 'Database';


-- View the total utilized budget of a department—in other words,
--  the combined salaries of all employees in that department.
SELECT name as department, sum(salary) as total_budget
from role
join department
ON role.department_id = department.id
AND department.name = 'Database';

-- Change Department of Employee by ID 
-- Telecommunications ID = 1 
UPDATE employee as e, role as r
SET r.department_id = 1
WHERE e.first_name = "Stan" AND e.role_id = r.id ;





-- View All
select *
from employee
join role
on employee.role_id = role.id
join department
ON role.department_id = department.id


