import 'dotenv/config';

import { defineConfig } from "drizzle-kit"

export default defineConfig({
    schema: "./src/db/migration.js",
    out: "./src/db/migrations",
    dialect: "mysql",
    dbCredentials: {
        host: process.env.MYSQL_HOST || 'localhost',
        port: parseInt(process.env.MYSQL_PORT ? process.env.MYSQL_PORT : "3306") || 3306,
        user: process.env.MYSQL_USERNAME || 'root',
        password:  process.env.MYSQL_PASSWORD || '',
        database: process.env.MYSQL_DATABASE || 'product_galery'
    }
})