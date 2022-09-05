const mysql = require("mysql2/promise");
const chalk = require("chalk");
const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_SCHEMA } = process.env;

async function connect() {
  try {
    const connection = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      DB_PASSWORD: DB_PASSWORD,
      database: DB_SCHEMA,
    });
    return connection;
  } catch (err) {
    console.error(chalk.red(err));
    throw new Error("Unable to connect to Database");
  }
}

module.exports = connect;
