// requiring the npm modules in the file.
const connection = require("./config/dbConfig");
require("dotenv").config();
const chalk = require("chalk");
const inquirer = require("inquirer");
const cTable = require("console.table");
const figlet = require("figlet");
const validate = require("./validate");
const connect = require("./config/dbConfig");

// connecting to the database
connection.connect((error) => {
  console.info(chalk.blue("=".repeat(50)));
  console.info(chalk.blue("Connection to database. . ."));
  console.info(chalk.blue("=".repeat(50)));
  console.info(chalk.blue("=".repeat(50)));
  console.info(chalk.blue("Connected to database. . . !"));
  console.info(chalk.blue("=".repeat(50)));

  console.log(chalk.blueBright.bold(figlet.textSync("Employee Tracker")));

  promptUser();
});

// prompting the user with questions/choices
const promptUser = () => {
  inquirer
    .prompt([
      {
        name: "choices",
        type: "list",
        message: "Please select an option:",
        choices: [
          "View All Employees",
          "View All Roles",
          "View All Departments",
          "View All Employees By Department",
          "View Department Budgets",
          "Update Employee Role",
          "Update Employee Manager",
          "Add Employee",
          "Add Role",
          "Add Department",
          "Remove Employee",
          "Remove Role",
          "Remove Department",
          "Exit",
        ],
      },
    ])
    .then((answers) => {
      const { choices } = answers;

      if (choices === "View All Employees") {
        viewAllEmployees();
      }

      if (choices === "View All Departments") {
        viewAllDepartments();
      }

      if (choices === "View All Employees By Department") {
        viewEmployeesByDepartment();
      }

      if (choices === "Add Employee") {
        addEmployee();
      }

      if (choices === "Remove Employee") {
        removeEmployee();
      }

      if (choices === "Update Employee Role") {
        updateEmployeeRole();
      }

      if (choices === "Update Employee Manager") {
        updateEmployeeManager();
      }

      if (choices === "View All Roles") {
        viewAllRoles();
      }

      if (choices === "Add Role") {
        addRole();
      }

      if (choices === "Remove Role") {
        removeRole();
      }

      if (choices === "Add Department") {
        addDepartment();
      }

      if (choices === "View Department Budgets") {
        viewDepartmentBudget();
      }

      if (choices === "Remove Department") {
        removeDepartment();
      }

      if (choices === "Exit") {
        connection.end();
      }
    });
};

// view all employees
const viewAllEmployees = () => {
  let sql = `SELECT employee.id, 
                  employee.first_name, 
                  employee.last_name, 
                  role.title, 
                  department.department_name AS 'department', 
                  role.salary
                  FROM employee, role, department 
                  WHERE department.id = role.department_id 
                  AND role.id = employee.role_id
                  ORDER BY employee.id ASC`;
  connection.query(sql, (error, response) => {
    if (error) throw error;
    console.info(chalk.red.bold("=".repeat(50)));
    console.log(`             ` + chalk.green.bold(`Current Employees:`));
    console.info(chalk.magenta.bold("=".repeat(50)));
    console.table(response);
    console.info(chalk.magenta.bold("=".repeat(50)));
    promptUser();
  });
};

// view all roles
const viewAllRoles = () => {
  console.info(chalk.yellow.bold("=".repeat(50)));
  console.log(`               ` + chalk.green.bold(`Current Employee Roles:`));
  console.info(chalk.yellow.bold("=".repeat(50)));
  const sql = `SELECT role.id, role.title, department.department_name AS department
                  FROM role
                  INNER JOIN department ON role.department_id = department.id`;
  connection.query(sql, (error, response) => {
    if (error) throw error;
    response.forEach((role) => {
      console.log(role.title);
    });
    console.info(chalk.yellow.bold("=".repeat(50)));
    promptUser();
  });
};
