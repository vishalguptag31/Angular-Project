let db = require('mariasql');
const databaseName = "simpliahead";
// const connection = new db({
//   host: 'localhost',
//   user: 'root',
//   password: 'root'
// });

let connection = new db({
  host: 'localhost',
  user: 'root',
  password: 'root'
});
/**
 * Establish mariadb connection  and create database
 */
connection.connect(function (err) {
  if (err) throw err;
  console.info('MariaDB : Connection established')
  connection.query("CREATE DATABASE IF NOT EXISTS " + databaseName, function (err, result) {
    if (err) throw err;
    console.info("MariaDB : Database created");

    /**
     * Use the specified database.
     */
    let useDatabaseQuery = `USE ${databaseName}`;
    connection.query(useDatabaseQuery, function (err, rows) {
      if (err) {
        console.error("MariaDB : Can't connect to " + databaseName);
      }
      else {
        console.log("MariaDB : Connected to " + databaseName)

        /**
         * Next, create tables
         */
        createTables()
          .then(result => {
            console.log(`MariaDB : ${tables.length} tables created`);
          })
          .catch(error => {
            console.log('MariaDB : Unable to create tables');
          })
      }
    })
  });
});


// Task table creation query.
let taskTable = `CREATE TABLE IF NOT EXISTS task (
	id INT(11) NOT NULL AUTO_INCREMENT,
	category_id INT(11) NOT NULL,
	user_id INT(11) NOT NULL,
	task_name TEXT NOT NULL,
	status VARCHAR(256) NOT NULL,
	assigned_by INT(11) NOT NULL,
	is_delayed TINYINT(1) NOT NULL DEFAULT '0',
	description TEXT NOT NULL,
	priority VARCHAR(256) NOT NULL,
  completed_on DATE NULL DEFAULT NULL,  
  planned_effort INT(11) NULL DEFAULT NULL,
  type VARCHAR(256) NOT NULL,
  remark TEXT NULL DEFAULT NULL,
	created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	updated_date DATE NOT NULL,
	critical_date DATE NULL DEFAULT NULL,
	completion_date DATE NOT NULL,
	PRIMARY KEY (id)
);`;

let categoryTable = `CREATE TABLE IF NOT EXISTS category (
	id INT(11) NOT NULL AUTO_INCREMENT,
	category_name VARCHAR(256) NOT NULL,
	added_by VARCHAR(256) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT '0',
  created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (id)
);`;


let userTable = `CREATE TABLE IF NOT EXISTS user (
	id INT(11) NOT NULL AUTO_INCREMENT,
	full_name VARCHAR(256) NOT NULL,
	email VARCHAR(256) NOT NULL,
	added_by VARCHAR(256) NULL DEFAULT NULL,
  password VARCHAR(256) NOT NULL,
  access_token VARCHAR(256) NULL DEFAULT NULL,
  expiration_time VARCHAR(100) NULL DEFAULT NULL,
	contact_number VARCHAR(25) DEFAULT NULL,
	is_active TINYINT(1) NOT NULL DEFAULT '0',
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (id)
)`;


let relationTable = `CREATE TABLE IF NOT EXISTS user_relation (
	id INT(11) NOT NULL AUTO_INCREMENT,
	current_user_id INT(11) NOT NULL,
	existing_user_id INT(11) NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (id)
)`;

let pollTable = `CREATE TABLE IF NOT EXISTS task_polling (
	id INT(11) NOT NULL AUTO_INCREMENT,
	task_id INT(11) NOT NULL,
  user_id INT(11) NOT NULL,
  remark TEXT NULL DEFAULT NULL,
  answer VARCHAR(11) NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (id)
)`;

const tables = [taskTable, categoryTable, userTable, relationTable, pollTable];
function createTables() {
  return new Promise((resolve, reject) => {
    tables.forEach((query, index) => {
      connection.query(query, function (error, result) {
        if (error) {
          reject(error)
        } else {
          if (tables.length - 1 === index) {
            resolve(result)
          }
        }
      })
    });
  })
}

exports.connection = connection;