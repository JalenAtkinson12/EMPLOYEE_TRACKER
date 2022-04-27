const inquirer = require('inquirer');
const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    },
    console.log(`You are connected to the ${process.env.DB_NAME} database.`)
);

function userChoice(){
    return inquirer.prompt([
        {name: 'Options',
      message: 'Please choose from these choices',
        type: 'list',
         choices: ["View Departments", "View Roles", "View Employees","Add Department", "Add Role","Add Employee","Update Role of Employee","Remove Employee", "Exit"]},
    ])
}

function addDepartment(){
    return inquirer.prompt ([
        {
            type: 'input',
            message: 'Please type in the name of the department',
            name: 'deptName',
        }
    ])
}

function addRole(){
    return inquirer.prompt([
        {
            type: 'input',
            message: 'Please type in the name of the role',
            name: 'roleName',
        },
        {
            type: 'number',
            message: 'please enter the salary',
            name: 'salary',
        },
        {
            type: 'number',
            message: 'Please enter the role department ID',
            name: 'deptName',
        }
    ])
}
function addEmployee(){
    return inquirer.prompt([
        {
            type: 'input',
            message: 'Please type in the first name of the Employee',
            name: 'firstName',
        },
        {
            type: 'input',
            message: 'please type in the last name of the Employee ',
            name: 'lastName',
        },
        {
            type: 'number',
            message: 'Please enter the Employee ID',
            name: 'roleName',
        },
        {
            type: 'number',
            message: "Please enter the Employee manager's ID",
            name: 'managerName',
        },
        {
            type: 'number',
            message: 'Please enter the Employee department ID',
            name: 'deptName',
        }
    ])
}
function updateEmployee(){
    return inquirer.prompt([
        {
            type: 'number',
            message: 'Please select any employee to update via ID',
            name: 'employeeSelect',
        },
        {
            type: 'number',
            message: 'please choose Employee new role ID ',
            name: 'newRole',
        },
        {
            type: 'number',
            message: "Please enter Employee's new Manager's Employee ID",
            name: 'managerSelection',
        },
        {
            type: 'number',
            message: "Please enter the Employee department ID",
            name: 'newDept',
        },
       
    ]);
}

function removeEmployee(){
    return inquirer.prompt([
        {
            type: 'number',
            message: 'Please choose employee to remove via ID ',
            name: 'employeeSelect',
        },
        {
            type: 'confirm',
            message: 'You really want to remove this employee?',
            name: 'confirmDestroy',
        },
       
    ]);
}   

async function optionHandler() {
    let input = await userChoice();
    if (input.Options === "View Departments") {
        db.query('SELECT * FROM department_table', function (err, results){
            if (err) {
                console.log(err);
            }
            console.table(results);
        });
    } else if (input.Options === "View Roles") {
        db.query('SELECT role_table.id AS role_id, role_table.role_name AS role_name, role_table.salary AS salary, department_table.department_name AS department_name FROM role_table JOIN department_table ON role_table.department_id = department_table.id', function (err,results){
            if (err) {
                console.log(err);
            }
            console.table(results);
        });
    } else if (input.Options === "View Employees") {
        db.query('SELECT employees_table_1.id AS employees_id, employees_table_1.first_name AS first_name, employees_table_1.last_name AS last_name, role_table.role_name AS role_name, role_table.salary AS salary, department_table.department_name AS department_name, employees_table.first_name AS mngr_1st_name, employees_table.last_name AS mngr_last_name FROM employees_table AS employees_table_1 JOIN role_table ON employees_table_1.role_id = role_table.id JOIN department_table ON employees_table_1.department_id = department_table.id LEFT OUTER JOIN employees_table ON employees_table_1.manager_id = employees_table.id;', function (err,results){
            if (err) {
                console.log(err);
            }
            console.table(results);
        });
    } else if (input.Options === "Add Department") {
        let addNewDepartment = await addDepartment();
        db.query(`INSERT INTO department_table (department_name) VALUES ("${addNewDepartment.deptName}")`, function(err, results){
            if (err) {
                console.log(err);
            }
            console.table(results);
        });
    } else if (input.Options === "Add Role") {
        let addNewRole = await addRole();
        db.query(`INSERT INTO role_table (role_name, salary, department_id) VALUES ("${addNewRole.roleName}", ${addNewRole.salary}, ${addNewRole.deptName})`, function(err, results){
            if (err) {
                console.log(err);
            }
            console.table(results);
        });
    } else if (input.Options === "Add Employee") {
        let addNewEmployee = await addEmployee();
        db.query(`INSERT INTO employees_table (first_name, last_name, manager_id, role_id , department_id) VALUES ("${addNewEmployee.fistName}", ${addNewEmployee.lastName}, ${addNewEmployee.managerName}, ${addNewEmployee.roleName}, ${addNewEmployee.deptName})`, function(err, results){
            if (err) {
                console.log(err);
            }
            console.table(results);
        });
    } else if (input.Options === "Update Role of Employee") {
        let updateAEmployee = await updateEmployee();
        db.query(`UPDATE employees_table SET role_id = "${updateAEmployee.newRole}" WHERE id = ?`, updateAEmployee.employeeSelect,(err, result) =>{
            if (err) {
                console.log(err);
            }
            console.table(result);
        });
        db.query(`UPDATE employees_table SET department_id = "${updateAEmployee.newDept}" WHERE id = ?`, updateAEmployee.employeeSelect,(err, result) =>{
            if (err) {
                console.log(err);
            }
            console.table(result);
        });
        db.query(`UPDATE employees_table SET department_id = "${updateAEmployee.managerSelection}" WHERE id = ?`, updateAEmployee.employeeSelect,(err, result) =>{
            if (err) {
                console.log(err);
            }
            console.table(result);
        });

    } else if (input.Options === "Remove Employee "){
        let removeAEmployee = await removeEmployee();
        if (removeAEmployee.confirmDestroy){
            db.query(`DELETE FROM employees_table WHERE id = ?`, removeAEmployee.employeeSelect, (err, result)=>{
                if (err) {
                    console.log(err);
                }
                console.log(result);
            });
        } else {
            await optionHandler();
        }
    } else if (input.Options === "Exit"){
        return;
    }
    await optionHandler();
}

module.exports = {optionHandler}