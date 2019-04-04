const mysql = require("mysql");
const config = require("../config");
const simulateSlowQuery = 0; // 1000 = 1 second by query
var db = mysql.createPool(config.MYSQL);

class mysqlConnectionInst {
  constructor(connection) {
    this.connection = connection;
  }
  query(sql, data = []) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, data, (error, results, fields) => {
        if (error) {
          reject(error);
          return;
        }
        if (simulateSlowQuery && simulateSlowQuery > 0) {
          setTimeout(() => resolve(results), simulateSlowQuery);
        } else {
          resolve(results);
        }
      });
    });
  }
}


class dbConnection {
  getConnection() {
    return new Promise((resolve, reject) => {
      db.getConnection((error, connection) => {
        if (error) {
          reject({
            error: "Cannot connect to database server"
          });
          return;
        }
        resolve(new mysqlConnectionInst(connection));
      });
    });
  }
  install(schema) { }
}

module.exports = new dbConnection();
