
import * as repo from '../repositories/houses.repository.js';

// GET ALL HOUSES
export async function getAll(req, res, next) {
    const houses = await repo.findAll();

    return res.status(200).json(houses);
}

// GET ONE HOUSE
export async function getOne(req, res, next) {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
        return res.sendStatus(400);
    }

    const house = await repo.findById(id);

    if (!house) {
        const error = new Error("House does not exist");
        error.statusCode = 404;
        throw error;
    }

    return res.status(200).json(house);
}

