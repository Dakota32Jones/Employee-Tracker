INSERT INTO department(department_name)
VALUES('Engineering'), ('Sales'), ('Finance'), ('Legal'), ('Marketing');

INSERT INTO role(title, salary, department_id)
VALUES('Engineer', 90000, 1), ('Senior Engineer', 130000, 1), ('CFO', 400000, 3), ('Chief Counsel', 285000, 4);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ('Brad', 'Stephens', 1, 2), ('Jackie', 'Robinson', 1, null), ('Hennesy', 'Cognac', 1, 2), ('Buzz', 'Lightyear', 2, 2), ('James', 'Bond', 4, null);