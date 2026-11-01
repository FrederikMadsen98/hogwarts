import 'dotenv/config';
import pg from 'pg';

export const pool = new pg.Pool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME || 'hogwarts',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD
});