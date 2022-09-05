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

// view all Departments

const viewAllDepartments = () => {
  const sql = `SELECT department.id AS id, department.department_name AS department FROM department`;
  connection.query(sql, (error, response) => {
    if (error) throw error;
    console.info(chalk.yellow.bold("=".repeat(50)));
    console.log(`          ` + chalk.green.bold(`All Departments:`));
    console.info(chalk.yellow.bold("=".repeat(50)));
    console.table(response);
    console.info(chalk.yellow.bold("=".repeat(50)));
    promptUser();
  });
};

// view all Employees by Department
const viewEmployeesByDepartment = () => {
  const sql = `SELECT employee.first_name, 
                  employee.last_name, 
                  department.department_name AS department
                  FROM employee 
                  LEFT JOIN role ON employee.role_id = role.id 
                  LEFT JOIN department ON role.department_id = department.id`;
  connection.query(sql, (error, response) => {
    if (error) throw error;
    console.info(chalk.yellow.bold("=".repeat(50)));
    console.log(`         ` + chalk.green.bold(`Employees by Department:`));
    console.info(chalk.yellow.bold("=".repeat(50)));
    console.table(response);
    console.info(chalk.yellow.bold("=".repeat));
    promptUser();
  });
};

// view all departments by Budget
const viewDepartmentBudget = () => {
  console.info(chalk.yellow.bold("=".repeat(50)));
  console.log(`         ` + chalk.green.bold(`Budget By Department:`));
  console.info(chalk.yellow.bold("=".repeat(50)));
  const sql = `SELECT department_id AS id, 
                  department.department_name AS department,
                  SUM(salary) AS budget
                  FROM  role  
                  INNER JOIN department ON role.department_id = department.id GROUP BY  role.department_id`;
  connection.query(sql, (error, response) => {
    if (error) throw error;
    console.table(response);
    console.info(chalk.yellow.bold("=".repeat(50)));
    promptUser();
  });
};

// Adding to the tables

// add a new employee
const addEmployee = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "What is the employee's first name?",
        validate: (addFirstName) => {
          if (addFirstName) {
            return true;
          } else {
            console.log("Please enter a first name");
            return false;
          }
        },
      },
      {
        type: "input",
        name: "lastName",
        message: "What is the employee's last name?",
        validate: (addLastName) => {
          if (addLastName) {
            return true;
          } else {
            console.log("Please enter a last name");
            return false;
          }
        },
      },
    ])
    .then((answer) => {
      const crit = [answer.firstName, answer.lastName];
      const roleSql = `SELECT role.id, role.title FROM role`;
      connection.query(roleSql, (error, data) => {
        if (error) throw error;
        const roles = data.map(({ id, title }) => ({ name: title, value: id }));
        inquirer
          .prompt([
            {
              type: "list",
              name: "role",
              message: "What is the employee's role?",
              choices: roles,
            },
          ])
          .then((roleChoice) => {
            const role = roleChoice.role;
            crit.push(role);
            const managerSql = `SELECT * FROM employee`;
            connection.query(managerSql, (error, data) => {
              if (error) throw error;
              const managers = data.map(({ id, first_name, last_name }) => ({
                name: first_name + " " + last_name,
                value: id,
              }));
              inquirer
                .prompt([
                  {
                    type: "list",
                    name: "manager",
                    message: "Who is the employee's manager?",
                    choices: managers,
                  },
                ])
                .then((managerChoice) => {
                  const manager = managerChoice.manager;
                  crit.push(manager);
                  const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                  VALUES (?, ?, ?, ?)`;
                  connection.query(sql, crit, (error) => {
                    if (error) throw error;
                    console.log("Employee has been added!");
                    viewAllEmployees();
                  });
                });
            });
          });
      });
    });
};

// add a new role
const addRole = () => {
  const sql = "SELECT * FROM department";
  connection.query(sql, (error, response) => {
    if (error) throw error;
    let deptNamesArray = [];
    response.forEach((department) => {
      deptNamesArray.push(department.department_name);
    });
    deptNamesArray.push("Create Department");
    inquirer
      .prompt([
        {
          name: "departmentName",
          type: "list",
          message: "Which department is this new role in?",
          choices: deptNamesArray,
        },
      ])
      .then((answer) => {
        if (answer.departmentName === "Create Department") {
          this.addDepartment();
        } else {
          addRoleResume(answer);
        }
      });

    const addRoleResume = (departmentData) => {
      inquirer
        .prompt([
          {
            name: "newRole",
            type: "input",
            message: "What is the name of your new role?",
            validate: validate.validateString,
          },
          {
            name: "salary",
            type: "input",
            message: "What is the salary of this new role?",
            validate: validate.validateSalary,
          },
        ])
        .then((answer) => {
          let createdRole = answer.newRole;
          let departmentId;

          response.forEach((department) => {
            if (departmentData.departmentName === department.department_name) {
              departmentId = department.id;
            }
          });

          let sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
          let crit = [createdRole, answer.salary, departmentId];

          connection.query(sql, crit, (error) => {
            if (error) throw error;
            console.info(chalk.magentaBright.bold("=".repeat(50)));
            console.log(chalk.whiteBright(`Role successfully created!`));
            console.info(chalk.magentaBright.bold("=".repeat(50)));
            viewAllRoles();
          });
        });
    };
  });
};

// add a new department

const addDepartment = () => {
  inquirer
    .prompt([
      {
        name: "newDepartment",
        type: "input",
        message: "What is the name of your new Department?",
        validate: validate.validateString,
      },
    ])
    .then((answer) => {
      let sql = `INSERT INTO department (department_name) VALUES (?)`;
      connection.query(sql, answer.newDepartment, (error, response) => {
        if (error) throw error;
        console.log(``);
        console.log(
          chalk.whiteBright(
            answer.newDepartment + ` Department successfully created!`
          )
        );
        console.log(``);
        viewAllDepartments();
      });
    });
};

// Updating the table

// Updating the Employee's Role

const updateEmployeeRole = () => {
  let sql = `SELECT employee.id, employee.first_name, employee.last_name, role.id AS "role_id"
                  FROM employee, role, department WHERE department.id = role.department_id AND role.id = employee.role_id`;
  connection.query(sql, (error, response) => {
    if (error) throw error;
    let employeeNamesArray = [];
    response.forEach((employee) => {
      employeeNamesArray.push(`${employee.first_name} ${employee.last_name}`);
    });

    let sql = `SELECT role.id, role.title FROM role`;
    connection.query(sql, (error, response) => {
      if (error) throw error;
      let rolesArray = [];
      response.forEach((role) => {
        rolesArray.push(role.title);
      });

      inquirer
        .prompt([
          {
            name: "chosenEmployee",
            type: "list",
            message: "Which employee has a new role?",
            choices: employeeNamesArray,
          },
          {
            name: "chosenRole",
            type: "list",
            message: "What is their new role?",
            choices: rolesArray,
          },
        ])
        .then((answer) => {
          let newTitleId, employeeId;

          response.forEach((role) => {
            if (answer.chosenRole === role.title) {
              newTitleId = role.id;
            }
          });

          response.forEach((employee) => {
            if (
              answer.chosenEmployee ===
              `${employee.first_name} ${employee.last_name}`
            ) {
              employeeId = employee.id;
            }
          });

          let sqls = `UPDATE employee SET employee.role_id = ? WHERE employee.id = ?`;
          connection.query(sqls, [newTitleId, employeeId], (error) => {
            if (error) throw error;
            console.info(chalk.greenBright.bold("=".repeat(50)));
            console.log(chalk.yellowBright(`Employee Role Updated`));
            console.log(chalk.greenBright.bold("=".repeat(50)));
            promptUser();
          });
        });
    });
  });
};

// Update Employee's Manager
