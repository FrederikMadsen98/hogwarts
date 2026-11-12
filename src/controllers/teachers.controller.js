
import * as repo from '../repositories/teachers.repository.js';
import * as houses from '../repositories/houses.repository.js';
import HTTPError from '../errorhandling/HTTPError.js';

// GET ALL TEACHERS
export async function getAll(req, res, next) {
    const teachers = await repo.findAll();

    return res.status(200).json(teachers);
}

// GET ONE TEACHER
export async function getOne(req, res, next) {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
        throw new HTTPError(400, "Invalid teacher ID");
    }

    const teacher = await repo.findById(id);

    if (!teacher) {
        throw new HTTPError(404, "Teacher not found");
    }

    return res.status(200).json(teacher);
}

// CREATE TEACHER

export async function create(req, res, next) {
    const { name, house_id } = req.body ?? {};

    const houseId = house_id == null ? null : Number(house_id);

    if (
        typeof name !== 'string' ||
        name.trim().length === 0 ||
        name.trim().length > 150 ||
        (houseId !== null &&
            (!Number.isSafeInteger(houseId) || houseId <= 0))
    ) {
        throw new HTTPError(400, "Invalid name or house_id");
    }

    if (houseId !== null) {
        const house = await houses.findById(houseId);

        if (!house) {
            throw new HTTPError(404, "House not found");
        }
    }

    const teacher = await repo.create(name.trim(), houseId);

    return res.status(201)
        .location(`/teachers/${teacher.id}`)
        .json(teacher);
}


// UPDATE TEACHER

export async function update(req, res, next) {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
        throw new HTTPError(400, "Invalid teacher ID");
    }

    const teacher = await repo.findById(id);

    if (!teacher) {
        throw new HTTPError(404, "Teacher not found");
    }

    const { name, house_id } = req.body ?? {};

    const houseId = house_id == null ? null : Number(house_id);

    if (
        typeof name !== 'string' ||
        name.trim().length === 0 ||
        name.trim().length > 150 ||
        (houseId !== null &&
            (!Number.isSafeInteger(houseId) || houseId <= 0))
    ) {
        throw new HTTPError(400, "Invalid name or house_id");
    }

    if (houseId !== null) {
        const house = await houses.findById(houseId);

        if (!house) {
            throw new HTTPError(404, "House not found");
        }
    }

    const updatedTeacher = await repo.update(
        id,
        name.trim(),
        houseId
    );

    return res.status(200).json(updatedTeacher);
}

// DELETE TEACHER
export async function remove(req, res, next) {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
        throw new HTTPError(400, "Invalid teacher ID");
    }

    const deleted = await repo.remove(id);

    if (!deleted) {
        throw new HTTPError(404, "Teacher not found");
    }

    return res.sendStatus(204);
}
