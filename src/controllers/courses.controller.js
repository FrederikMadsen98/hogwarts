import * as repo from '../repositories/courses.repository.js';
import * as teachers from '../repositories/teachers.repository.js';
import * as students from '../repositories/students.repository.js';


async function withStudents(course) {
    const courseStudents = await repo.findStudents(course.id);

    return {
        ...course,
        students: courseStudents
    };
}

export async function getAll(req, res, next) {
    try {
        const courses = await repo.findAll();

        const coursesWithStudents = await Promise.all(
            courses.map(withStudents)
        );

        return res.status(200).json(coursesWithStudents);

    } catch (error) {
        next(error);
    }
}

export async function getOne(req, res, next) {
    try {
        const id = Number(req.params.id);

        if (!Number.isSafeInteger(id) || id <= 0) {
            return res.sendStatus(400);
        }

        const course = await repo.findById(id);

        if (!course) {
            return res.sendStatus(404);
        }

        return res.status(200).json(
            await withStudents(course)
        );

    } catch (error) {
        next(error);
    }
}

export async function create(req, res, next) {
    try {
        const { name, teacher_id } = req.body ?? {};
        const teacherId = Number(teacher_id);

        if (
            typeof name !== 'string' ||
            name.trim().length === 0 ||
            name.trim().length > 150 ||
            teacher_id == null ||
            !Number.isSafeInteger(teacherId) ||
            teacherId <= 0
        ) {
            return res.status(400).json({
                error: 'name and teacher_id required'
            });
        }

        const teacher = await teachers.findById(teacherId);

        if (!teacher) {
            return res.sendStatus(404);
        }

        const course = await repo.create(name.trim(), teacherId);

        const createdCourse = await repo.findById(course.id);

        return res.status(201)
            .location(`/courses/${course.id}`)
            .json(await withStudents(createdCourse));

    } catch (error) {
        next(error);
    }
}

export async function update(req, res, next) {
    try {
        const id = Number(req.params.id);

        if (!Number.isSafeInteger(id) || id <= 0) {
            return res.sendStatus(400);
        }

        const course = await repo.findById(id);

        if (!course) {
            return res.sendStatus(404);
        }

        const { name, teacher_id } = req.body ?? {};
        const teacherId = Number(teacher_id);

        if (
            typeof name !== 'string' ||
            name.trim().length === 0 ||
            name.trim().length > 150 ||
            teacher_id == null ||
            !Number.isSafeInteger(teacherId) ||
            teacherId <= 0
        ) {
            return res.status(400).json({
                error: 'name and teacher_id required'
            });
        }

        const teacher = await teachers.findById(teacherId);

        if (!teacher) {
            return res.sendStatus(404);
        }

        await repo.update(id, name.trim(), teacherId);

        const updatedCourse = await repo.findById(id);

        return res.status(200).json(
            await withStudents(updatedCourse)
        );

    } catch (error) {
        next(error);
    }
}

export async function changeTeacher(req, res, next) {
    try {
        const id = Number(req.params.id);
        const teacherId = Number(req.body?.teacher_id);

        if (
            !Number.isSafeInteger(id) || id <= 0 ||
            req.body?.teacher_id == null ||
            !Number.isSafeInteger(teacherId) || teacherId <= 0
        ) {
            return res.sendStatus(400);
        }

        const course = await repo.findById(id);
        const teacher = await teachers.findById(teacherId);

        if (!course || !teacher) {
            return res.sendStatus(404);
        }

        await repo.changeTeacher(id, teacherId);

        const updatedCourse = await repo.findById(id);

        return res.status(200).json(
            await withStudents(updatedCourse)
        );

    } catch (error) {
        next(error);
    }
}

export async function addStudent(req, res, next) {
    try {
        const id = Number(req.params.id);
        const studentId = Number(req.params.studentId);

        if (
            !Number.isSafeInteger(id) || id <= 0 ||
            !Number.isSafeInteger(studentId) || studentId <= 0
        ) {
            return res.sendStatus(400);
        }

        const course = await repo.findById(id);
        const student = await students.findById(studentId);

        if (!course || !student) {
            return res.sendStatus(404);
        }

        const added = await repo.addStudent(id, studentId);

        if (added) {
            return res.status(201)
                .location(`/courses/${id}/students/${studentId}`)
                .end();
        }

        return res.sendStatus(204);

    } catch (error) {
        next(error);
    }
}

export async function removeStudent(req, res, next) {
    try {
        const id = Number(req.params.id);
        const studentId = Number(req.params.studentId);

        if (
            !Number.isSafeInteger(id) || id <= 0 ||
            !Number.isSafeInteger(studentId) || studentId <= 0
        ) {
            return res.sendStatus(400);
        }

        const course = await repo.findById(id);

        if (!course) {
            return res.sendStatus(404);
        }

        const removed = await repo.removeStudent(id, studentId);

        if (!removed) {
            return res.sendStatus(404);
        }

        return res.sendStatus(204);

    } catch (error) {
        next(error);
    }
}

export async function remove(req, res, next) {
    try {
        const id = Number(req.params.id);

        if (!Number.isSafeInteger(id) || id <= 0) {
            return res.sendStatus(400);
        }

        const deleted = await repo.remove(id);

        if (!deleted) {
            return res.sendStatus(404);
        }

        return res.sendStatus(204);

    } catch (error) {
        next(error);
    }
}