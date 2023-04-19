import sqlite3 from "sqlite3"
sqlite3.verbose();

// Open a new SQLite database
const db = new sqlite3.Database('employees.db');

// Create the employees table
db.run(`
  CREATE TABLE IF NOT EXISTS employees (
    employeeID INTEGER PRIMARY KEY,
    employeeCode TEXT NOT NULL,
    name TEXT,
    checkedIn INTEGER DEFAULT 0
  )
`, function(error) {
  if(error) {
    console.log(error.message)
  } else {
    // Insert dummy employees into the employees table
    db.run(`
      INSERT INTO employees (employeeCode) VALUES ('alice'), ('andreas')`, 
      (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log('Dummy employees added to the database');
      }
    });
  }
});

// Create the check_ins_outs table
db.run(`
  CREATE TABLE IF NOT EXISTS check_ins_outs (
    id INTEGER PRIMARY KEY,
    employeeID INTEGER,
    check_in_time INTEGER NOT NULL,
    check_out_time INTEGER,
    FOREIGN KEY(employeeID) REFERENCES employees(employeeID)
  )
`);

// Close the database connection
db.close();