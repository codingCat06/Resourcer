const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: '20060322a**',
  database: 'resourcer'
});

async function columnExists(tableName, columnName) {
  try {
    const [rows] = await connection.promise().execute(`
      SELECT COUNT(*) as count FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'resourcer' AND TABLE_NAME = ? AND COLUMN_NAME = ?
    `, [tableName, columnName]);
    return rows[0].count > 0;
  } catch (error) {
    return false;
  }
}

async function tableExists(tableName) {
  try {
    const [rows] = await connection.promise().execute(`
      SELECT COUNT(*) as count FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = 'resourcer' AND TABLE_NAME = ?
    `, [tableName]);
    return rows[0].count > 0;
  } catch (error) {
    return false;
  }
}

async function migrate() {
  console.log('Starting database migration...');
  
  try {
    // Add is_active column to users table if it doesn't exist
    if (!(await columnExists('users', 'is_active'))) {
      await connection.promise().execute(`
        ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT TRUE AFTER total_earnings
      `);
      console.log('✓ Added is_active column to users table');
    } else {
      console.log('⚡ is_active column already exists in users table');
    }

    // Add last_login column to users table if it doesn't exist
    if (!(await columnExists('users', 'last_login'))) {
      await connection.promise().execute(`
        ALTER TABLE users ADD COLUMN last_login TIMESTAMP NULL AFTER is_active
      `);
      console.log('✓ Added last_login column to users table');
    } else {
      console.log('⚡ last_login column already exists in users table');
    }

    // Create contacts table if it doesn't exist
    if (!(await tableExists('contacts'))) {
      await connection.promise().execute(`
        CREATE TABLE contacts (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100) NOT NULL,
          subject ENUM('general', 'technical', 'business', 'bug', 'feature', 'other') NOT NULL,
          message TEXT NOT NULL,
          status ENUM('new', 'in_progress', 'resolved', 'closed') DEFAULT 'new',
          admin_notes TEXT,
          admin_id INT,
          admin_username VARCHAR(50),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_status (status),
          INDEX idx_created_at (created_at),
          FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE SET NULL
        )
      `);
      console.log('✓ Created contacts table');
    } else {
      console.log('⚡ contacts table already exists');
    }

    // Update existing users to set is_active = TRUE
    await connection.promise().execute(`
      UPDATE users SET is_active = TRUE WHERE is_active IS NULL
    `);
    console.log('✓ Updated existing users is_active status');

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    connection.end();
  }
}

migrate();