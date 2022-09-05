require("dotenv").config();
const chalk = require("chalk");
const dbConfig = require("./config/dbConfig");

async function main() {
  const dbConnection = await dbConfig();

  console.log(dbConnection);
}

main();
