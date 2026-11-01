import { pool } from '../db/database.js';

export async function findAll() {
    const result = await pool.query(`
        SELECT id, name, colors, founder
        FROM houses
        ORDER BY id
    `);

    return result.rows;
}

export async function findById(id) {
    const result = await pool.query(`
        SELECT id, name, colors, founder
        FROM houses
        WHERE id = $1
    `, [id]);

    return result.rows[0] || null;
}