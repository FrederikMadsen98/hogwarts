import * as repo from '../repositories/houses.repository.js';



export async function getAll(req, res, next) {
    try {
        const houses = await repo.findAll();

        return res.status(200).json(houses);

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

        const house = await repo.findById(id);

        if (!house) {
            return res.sendStatus(404);
        }

        return res.status(200).json(house);

    } catch (error) {
        next(error);
    }
}
