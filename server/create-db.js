const mysql = require('mysql2/promise');
require('dotenv').config();

async function createDatabase() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT
    });

    try {
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
        console.log(`Database ${process.env.DB_NAME} created or already exists.`);
        
        await connection.query(`USE \`${process.env.DB_NAME}\`;`);
        
        const initSql = require('fs').readFileSync('./init.sql', 'utf8');
        // Simple split by ; - might be fragile but should work for this init.sql
        const statements = initSql.split(';').filter(s => s.trim());
        
        for (let statement of statements) {
            if (statement.trim()) {
                await connection.query(statement);
            }
        }
        
        console.log('Tables initialized successfully.');
    } catch (error) {
        console.error('Error creating database:', error);
    } finally {
        await connection.end();
    }
}

createDatabase();