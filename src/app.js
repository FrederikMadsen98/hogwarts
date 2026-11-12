
import express from 'express';
import 'dotenv/config';

import housesRoutes from './routes/houses.routes.js';
import teachersRoutes from './routes/teachers.routes.js';
import studentsRoutes from './routes/students.routes.js';
import coursesRoutes from './routes/courses.routes.js';
import errorhandler from './errorhandling/errorhandler.js';

const app = express();
const port = 3000;

app.use(express.json());

app.use('/houses', housesRoutes);
app.use('/teachers', teachersRoutes);
app.use('/students', studentsRoutes);
app.use('/courses', coursesRoutes);

app.use(errorhandler);

app.listen(port, () => {
    console.log(`Hogwarts project listen ${port}`);
});
