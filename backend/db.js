const db = require("./database");

// DROP TABLES IF EXIST (ORDER MATTERS: children → parent)
const dropTables = `
  DROP TABLE IF EXISTS transactions;
  DROP TABLE IF EXISTS accounts;
  DROP TABLE IF EXISTS users;
`;

// CREATE TABLES
const createUsers = `
  CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    dob DATE
  );
`;

const createAccounts = `
  CREATE TABLE accounts (
  user_id INT NOT NULL,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    name VARCHAR(255) NOT NULL, 
    account_id INT AUTO_INCREMENT PRIMARY KEY,
    account_type VARCHAR(100),
    balance DECIMAL(10, 2),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
  );
`;

const createTransactions = `
  CREATE TABLE IF NOT EXISTS transactions (
    account_id INT NOT NULL, 
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_type ENUM('Expense', 'Income') NOT NULL,
    transaction_amount DECIMAL(10, 2) NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

db.query(dropTables, (err) => {
  if (err) {
    console.error("❌ Failed to drop tables:", err);
    return db.end();
  }

  console.log("✅ Dropped existing tables");

  db.query(createUsers, (err) => {
    if (err) {
      console.error("❌ Failed to create users table:", err);
      return db.end();
    }
    console.log("✅ Created 'users' table");

    db.query(createAccounts, (err) => {
      if (err) {
        console.error("❌ Failed to create accounts table:", err);
        return db.end();
      }
      console.log("✅ Created 'accounts' table");

      db.query(createTransactions, (err) => {
        if (err) {
          console.error("❌ Failed to create transactions table:", err);
        } else {
          console.log("✅ Created 'transactions' table");
        }
        db.end(); // close connection at the end
      });
    });
  });
});
