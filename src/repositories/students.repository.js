import { pool } from '../db/database.js';


export async function findAll() {
    const result = await pool.query(`
        SELECT
            s.id,
            s.name,
            s.year,
            s.house_id,
            h.name AS house_name
        FROM students s
        JOIN houses h ON h.id = s.house_id
        ORDER BY s.id
    `);

    return result.rows;
}

export async function findById(id) {
    const result = await pool.query(`
        SELECT
            s.id,
            s.name,
            s.year,
            s.house_id,
            h.name AS house_name
        FROM students s
        JOIN houses h ON h.id = s.house_id
        WHERE s.id = $1
    `, [id]);

    return result.rows[0] || null;
}

export async function create(name, year, houseId) {
    const result = await pool.query(`
        INSERT INTO students (name, year, house_id)
        VALUES ($1, $2, $3)
        RETURNING *
    `, [name, year, houseId]);

    return result.rows[0];
}

export async function update(id, name, year, houseId) {
    const result = await pool.query(`
        UPDATE students
        SET name = $2,
            year = $3,
            house_id = $4
        WHERE id = $1
        RETURNING *
    `, [id, name, year, houseId]);

    return result.rows[0] || null;
}

export async function remove(id) {
    const result = await pool.query(`
        DELETE FROM students
        WHERE id = $1
        RETURNING id
    `, [id]);

    return result.rowCount > 0;
}