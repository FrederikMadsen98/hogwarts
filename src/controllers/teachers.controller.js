
import * as repo from '../repositories/teachers.repository.js';
import * as houses from '../repositories/houses.repository.js';

export async function getAll(req, res, next) {
    try {
        const teachers = await repo.findAll();
        return res.status(200).json(teachers);
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

        const teacher = await repo.findById(id);

        if (!teacher) {
            return res.sendStatus(404);
        }

        return res.status(200).json(teacher);
    } catch (error) {
        next(error);
    }
}

export async function create(req, res, next) {
    try {
        const { name, house_id } = req.body ?? {};
        const houseId = Number(house_id);

        if (
            typeof name !== 'string' ||
            name.trim().length === 0 ||
            name.trim().length > 150 ||
            house_id == null ||
            !Number.isSafeInteger(houseId) ||
            houseId <= 0
        ) {
            return res.sendStatus(400);
        }

        const house = await houses.findById(houseId);

        if (!house) {
            return res.sendStatus(404);
        }

        const teacher = await repo.create(name.trim(), houseId);

        return res.status(201)
            .location(`/teachers/${teacher.id}`)
            .json(teacher);

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

        const teacher = await repo.findById(id);

        if (!teacher) {
            return res.sendStatus(404);
        }

        const { name, house_id } = req.body ?? {};
        const houseId = Number(house_id);

        if (
            typeof name !== 'string' ||
            name.trim().length === 0 ||
            name.trim().length > 150 ||
            house_id == null ||
            !Number.isSafeInteger(houseId) ||
            houseId <= 0
        ) {
            return res.sendStatus(400);
        }

        const house = await houses.findById(houseId);

        if (!house) {
            return res.sendStatus(404);
        }

        const updatedTeacher = await repo.update(
            id,
            name.trim(),
            houseId
        );

        return res.status(200).json(updatedTeacher);

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