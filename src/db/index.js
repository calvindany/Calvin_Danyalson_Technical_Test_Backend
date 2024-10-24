const { drizzle } = require("drizzle-orm/mysql2");
const mysql = require("mysql2/promise");
const schema = require("./schema");

let db;  // Keep db as a global variable

async function initDb() {
    const connection = await mysql.createConnection({
        host: process.env.MYSQL_HOST || 'localhost',
        port: process.env.MYSQL_PORT || '3306',
        user: process.env.MYSQL_USERNAME || 'root',
        password: process.env.MYSQL_PASSWORD || '',
        database: process.env.MYSQL_DATABASE || 'product_galery',
        mode: "default",
    });
    db = drizzle(connection, { schema, mode: "default" });
}

exports.initDb = initDb;
exports.getDb = () => db;
