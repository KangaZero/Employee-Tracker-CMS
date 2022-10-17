INSERT INTO department(name)
    VALUES ("Telecommunications"),
           ("Troubleshooting"),
           ("Database"),
           ("Security"),
           ("Software");

-- 1 manager and 2 employees per department 
INSERT INTO role(title, salary, department_id)
    VALUES ("manager", 85000, 1),
           ("employee", 50000, 1), 
           ("employee", 50000, 1), 
           ("manager", 85000, 2),
           ("employee", 50000, 2),
           ("employee", 50000, 2), 
           ("manager", 85000, 3),
           ("employee", 50000, 3),
           ("employee", 50000, 3), 
           ("manager", 85000, 4),
           ("employee", 50000, 4),
           ("employee", 50000, 4), 
           ("manager", 85000, 5),
           ("employee", 50000, 5),
           ("employee", 50000, 5); 

Insert into employee(first_name, last_name, role_id, manager_id)
    VALUES ("Melissa", "Church", 1, 1),
           ("Asa", "Sharma", 2, null),
           ("Zayden", "Fletcher", 3, null),
           ("Anastasia", "Begum", 4, 4),
           ("Stan", "Lott", 5, null),
           ("Vienna", "Summers", 6, null),
           ("Huda", "Andersen", 7, 7),
           ("Krystal", "Hale", 8, null),
           ("Isadora", "Connelly", 9, null),
           ("Laurie", "Cobb", 10, 10),
           ("Cari", "Harper", 11, null),
           ("Barney", "Gilliam", 12, null),
           ("Sofija", "Lim", 13, 13),
           ("Sanaa", "Cano", 14, null),
           ("Korban", "Knight", 15, null);