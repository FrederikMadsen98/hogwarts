import express from 'express';
import 'dotenv/config';

import housesRoutes from './routes/houses.routes.js';
import teachersRoutes from './routes/teachers.routes.js';
import studentsRoutes from './routes/students.routes.js';
import coursesRoutes from './routes/courses.routes.js';

const app = express();

app.use(express.json());

// Routes
app.use('/houses', housesRoutes);
app.use('/teachers', teachersRoutes);
app.use('/students', studentsRoutes);
app.use('/courses', coursesRoutes);

app.use((req, res) => {
    return res.status(404).json({
        error: 'Route not found'
    });
});


app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && 'body' in err) {
        return res.status(400).json({
            error: 'Invalid JSON'
        });
    }

    if (err.code === '23503') {
        return res.status(409).json({
            error: 'Foreign key constraint violation'
        });
    }

    if (err.code === '23505') {
        return res.status(409).json({
            error: 'Duplicate record'
        });
    }

    console.error(err);

    return res.status(500).json({
        error: 'Unexpected server error'
    });
});

const port = Number(process.env.PORT || 3000);

app.listen(port, () => {
    console.log(`Hogwarts API: http://localhost:${port}`);
});
