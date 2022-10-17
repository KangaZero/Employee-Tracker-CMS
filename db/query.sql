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