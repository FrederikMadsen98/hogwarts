import { pool } from '../db/database.js';

export async function findAll() {
    const result = await pool.query(`
        SELECT
            t.id,
            t.name,
            t.house_id,
            h.name AS house_name
        FROM teachers t
        JOIN houses h ON h.id = t.house_id
        ORDER BY t.id
    `);

    return result.rows;
}

export async function findById(id) {
    const result = await pool.query(`
        SELECT
            t.id,
            t.name,
            t.house_id,
            h.name AS house_name
        FROM teachers t
        JOIN houses h ON h.id = t.house_id
        WHERE t.id = $1
    `, [id]);

    return result.rows[0] || null;
}

export async function create(name, houseId) {
    const result = await pool.query(`
        INSERT INTO teachers (name, house_id)
        VALUES ($1, $2)
        RETURNING *
    `, [name, houseId]);

    return result.rows[0];
}


export async function update(id, name, houseId) {
    const result = await pool.query(`
        UPDATE teachers
        SET name = $2, house_id = $3
        WHERE id = $1
        RETURNING *
    `, [id, name, houseId]);

    return result.rows[0] || null;
}

export async function remove(id) {
    const result = await pool.query(`
        DELETE FROM teachers
        WHERE id = $1
        RETURNING id
    `, [id]);

    return result.rowCount > 0;
}
