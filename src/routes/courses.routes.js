import { Router } from 'express';
import * as controller from '../controllers/courses.controller.js';

const router = Router();

router.get('/', controller.getAll);
router.get('/:id', controller.getOne);

router.post('/', controller.create);

router.put('/:id', controller.update);
router.patch('/:id/teacher', controller.changeTeacher);

router.put('/:id/students/:studentId', controller.addStudent);
router.delete('/:id/students/:studentId', controller.removeStudent);

router.delete('/:id', controller.remove);

export default router;