import * as repo from '../repositories/students.repository.js';
import * as houses from '../repositories/houses.repository.js';


export async function getAll(req, res, next) {
    try {
        const students = await repo.findAll();

        return res.status(200).json(students);

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

        const student = await repo.findById(id);

        if (!student) {
            return res.sendStatus(404);
        }

        return res.status(200).json(student);

    } catch (error) {
        next(error);
    }
}

export async function create(req, res, next) {
    try {
        const { name, year, house_id } = req.body ?? {};
        const houseId = Number(house_id);

        if (
            typeof name !== 'string' ||
            name.trim().length === 0 ||
            name.trim().length > 150 ||
            !Number.isInteger(year) ||
            year < 1 ||
            year > 7 ||
            house_id == null ||
            !Number.isSafeInteger(houseId) ||
            houseId <= 0
        ) {
            return res.status(400).json({
                error: 'name, year (1-7) and house_id required'
            });
        }

        const house = await houses.findById(houseId);

        if (!house) {
            return res.sendStatus(404);
        }

        const student = await repo.create(
            name.trim(),
            year,
            houseId
        );

        return res.status(201)
            .location(`/students/${student.id}`)
            .json(student);

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

        const student = await repo.findById(id);

        if (!student) {
            return res.sendStatus(404);
        }

        const { name, year, house_id } = req.body ?? {};
        const houseId = Number(house_id);

        if (
            typeof name !== 'string' ||
            name.trim().length === 0 ||
            name.trim().length > 150 ||
            !Number.isInteger(year) ||
            year < 1 ||
            year > 7 ||
            house_id == null ||
            !Number.isSafeInteger(houseId) ||
            houseId <= 0
        ) {
            return res.status(400).json({
                error: 'name, year (1-7) and house_id required'
            });
        }

        const house = await houses.findById(houseId);

        if (!house) {
            return res.sendStatus(404);
        }

        const updatedStudent = await repo.update(
            id,
            name.trim(),
            year,
            houseId
        );

        return res.status(200).json(updatedStudent);

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
