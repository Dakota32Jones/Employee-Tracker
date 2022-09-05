// requiring the npm modules in the file.
require("dotenv").config();
const chalk = require("chalk");
const dbConfig = require("./config/dbConfig");
const inquirer = require("inquirer");
const cTable = require("console.table");
const figlet = require("figlet");
const validate = require("./validate");

// connecting to the database
async function main() {
  console.info(chalk.blue("=".repeat(30)));
  console.info(chalk.blue("Connection to database. . ."));
  console.info(chalk.blue("=".repeat(30)));
  const dbConnection = await dbConfig();
  console.info(chalk.blue("=".repeat(30)));
  console.info(chalk.blue("Connected to database. . . !"));
  console.info(chalk.blue("=".repeat(30)));

  console.log(chalk.blueBright.bold(figlet.textSync("Employee Tracker")));

  promptUser();
}
// calling the async function to run code above
main();

// prompting the user with questions/choices
