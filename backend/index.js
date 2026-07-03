import dotenv from 'dotenv';

dotenv.config({
    path: '.env'
});

import cors from 'cors';
import express from 'express';
import connectdb from './utils/db.js';
import userRouter from './routes/user.route.js';
import qualificationRouter from './routes/qualification.route.js';
import cookieParser from 'cookie-parser';
import { verifyUser } from './middleware/authentication.js';
const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

app.get('/', verifyUser, (req, res) => {
    res.send('hello');
});

app.use('/api/user', userRouter);
app.use('/api/qualification', qualificationRouter);

// connecting the db
connectdb().then(() => {
    app.listen(8000, () => {
        console.log(`the server is running at ${8000}`);
    });
});
