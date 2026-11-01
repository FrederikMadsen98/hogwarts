
import { pool } from '../db/database.js';

const base = `
    SELECT
        c.id,
        c.name,
        c.teacher_id,
        t.name AS teacher_name
    FROM courses c
    JOIN teachers t ON t.id = c.teacher_id
`;

export async function findAll() {
    const result = await pool.query(base + ' ORDER BY c.id');

    return result.rows;
}

export async function findById(id) {
    const result = await pool.query(
        base + ' WHERE c.id = $1',
        [id]
    );

    return result.rows[0] || null;
}

export async function findStudents(id) {
    const result = await pool.query(`
        SELECT
            s.id,
            s.name,
            s.year,
            s.house_id
        FROM students s
        JOIN course_students cs ON cs.student_id = s.id
        WHERE cs.course_id = $1
        ORDER BY s.id
    `, [id]);

    return result.rows;
}

export async function create(name, teacherId) {
    const result = await pool.query(`
        INSERT INTO courses (name, teacher_id)
        VALUES ($1, $2)
        RETURNING *
    `, [name, teacherId]);

    return result.rows[0];
}

export async function update(id, name, teacherId) {
    const result = await pool.query(`
        UPDATE courses
        SET name = $2,
            teacher_id = $3
        WHERE id = $1
        RETURNING *
    `, [id, name, teacherId]);

    return result.rows[0] || null;
}

export async function changeTeacher(id, teacherId) {
    const result = await pool.query(`
        UPDATE courses
        SET teacher_id = $2
        WHERE id = $1
        RETURNING *
    `, [id, teacherId]);

    return result.rows[0] || null;
}

export async function addStudent(id, studentId) {
    const result = await pool.query(`
        INSERT INTO course_students (course_id, student_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
        RETURNING *
    `, [id, studentId]);

    return result.rowCount > 0;
}

export async function removeStudent(id, studentId) {
    const result = await pool.query(`
        DELETE FROM course_students
        WHERE course_id = $1 AND student_id = $2
    `, [id, studentId]);

    return result.rowCount > 0;
}

export async function remove(id) {
    const result = await pool.query(`
        DELETE FROM courses
        WHERE id = $1
    `, [id]);

    return result.rowCount > 0;
}