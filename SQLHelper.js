import sqlite3 from 'sqlite3';

sqlite3.verbose();

export function checkIn(employeeID, check_in_time, callback) {
  const db = new sqlite3.Database('employees.db');

  // Start a transaction
  db.run('BEGIN TRANSACTION');

  db.run(`
    UPDATE employees SET checkedin = 1 WHERE employeeID = ?
  `, [employeeID], function(error) {
    if (error) {
      console.log(error.message);
      // Rollback the transaction and call the callback function with the error
      db.run('ROLLBACK');
      callback(error);
    } else {
      db.run(`
        INSERT INTO check_ins_outs(employeeID, check_in_time) VALUES (?, ?) 
        `, [employeeID, check_in_time] ,function(error) {
        if (error) {
          console.log(error.message);
          // Rollback the transaction and call the callback function with the error
          db.run('ROLLBACK');
          callback(error);
        } else {
          // Update the checkedin column in the users table
          console.log("checked in employeeID: " + employeeID + " - tableID: " + this.lastID)
          db.run("COMMIT");
          callback(this.lastID)
        }
      });
    }
  });
 

  db.close();
  // if function succedes
  return true;
}

export function checkOut(employeeID, tableID, check_out_time, callback) {
  const db = new sqlite3.Database('employees.db');
  // Start a transaction
  db.run('BEGIN TRANSACTION');
  
  // Update the checkedIn column in the users table
  db.run(`
    UPDATE employees SET checkedIn = 0 WHERE employeeID = ?
    `, [employeeID] ,function(error) {
    if (error) {
      console.log(error.message);
      db.run('ROLLBACK');
      callback(error);
    } else {
        // Update the check_out_time column in the check_ins_outs table for the employee with the given ID
        db.run(`
        UPDATE check_ins_outs SET check_out_time = ? WHERE id = ?
        `, [check_out_time, tableID], function(error) {
        if (error) {
          console.log(error.message);
          // Rollback the transaction and call the callback function with the error
          db.run('ROLLBACK');
          callback(error);
        } else {
          // Commit the transaction and call the callback function with no error
          console.log("checked out employeeID: " + employeeID + " - tableID: " + tableID)
          db.run('COMMIT');
          callback(1);
        }
      });
    }
  });

  db.close();
  // if function succedes
  return true;
}

export function login(employeeCode, callback) {
  const db = new sqlite3.Database('employees.db');

  db.get(`
    SELECT employeeID FROM employees WHERE employeeCode = ?
  `, [employeeCode], function(error, row) {
    if (error) {
      console.log(error.message);
      callback(null);
    } else {
      if (row) {
        callback(row.employeeID);
      } else {
        callback(null);
      }
    }
  });

  db.close();
  // if function succedes
  return true;
}

export function getEmployeeById(employeeID, callback) {
  const db = new sqlite3.Database('employees.db');

    db.get(`
      SELECT employees.*, check_ins_outs.check_in_time, check_ins_outs.check_out_time
      FROM employees
      LEFT JOIN (
          SELECT employeeID, MAX(check_in_time) AS latest_check_in_time
          FROM check_ins_outs
          GROUP BY employeeID
      ) AS latest_check_ins_outs
      ON employees.employeeID = latest_check_ins_outs.employeeID
      LEFT JOIN check_ins_outs
      ON latest_check_ins_outs.employeeID = check_ins_outs.employeeID AND latest_check_ins_outs.latest_check_in_time = check_ins_outs.check_in_time
      WHERE employees.employeeID = ?
    `, [employeeID], function(error, row) {
    if (error) {
      console.log(error.message);
      callback(error);
    } else if (!row) {
      console.log('User not found');
      callback(null, null);
    } else {
      callback(null, row);
    }
  });

  db.close();
  // if function succedes
  return true;
}

// Define a function to get all users and their check-in/out times as a JSON object attached to each user
export function getAllEmployeesWithCheckInOut(callback) {
  const db = new sqlite3.Database('employees.db');

  db.all(`
    SELECT employees.*,
      (
        SELECT JSON_GROUP_ARRAY(
          JSON_OBJECT('check_in_time', check_ins_outs.check_in_time, 
            'check_out_time', check_ins_outs.check_out_time)
          ) as times
        FROM check_ins_outs
        WHERE employees.employeeID = check_ins_outs.employeeID
        GROUP BY check_ins_outs.employeeID
      ) as times
    FROM employees`,
    (err, rows) => {
      if (err) {
        console.error(err.message);
        callback(null);
      } else {
        // Send the result as JSON
        callback(rows);
      }
    }
  );
  
  db.close();
  // if function succedes
  return true;
}
