INSERT INTO department_table (department_name)
VALUES ('Engineering'), 
       ('Finance'),
        ('Sales'),
          ('R&D');

INSERT INTO role_table (role_name, salary, department_id)
 VALUES ("Lead Engineer",170000,1),
        ("Software Engineer", 120000, 1),
        ("Accountant", 30000, 2),
        ("Sales Lead", 90000,3 ),
        ("Salesman",60000,3),
        ("R&D Manger", 130000,4);
        


INSERT INTO employees_table (first_name, last_name, manager_id, role_id, department_id)
VALUES ("Jay", "Atkins", 1, 1, 1),
       ("Ken", "Masters", 1, 2, 1),
       ("Ashley", "Graham", 3, 3, 2),
       ("Chloe", "Frazer", 3, 4, 3),
       ("Marcus", "Fenix", 5, 5, 3),
       ("Faith", "Conners", 5, 6, 4);

