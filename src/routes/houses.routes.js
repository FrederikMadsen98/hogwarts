import {Router} from 'express';
import * as controller from '../controllers/houses.controller.js';

const router=Router();

router.get('/',controller.getAll);
router.get('/:id',controller.getOne);

export default router;
