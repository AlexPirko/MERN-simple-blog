import express from 'express';
import cors from 'cors';
import fs from 'fs';
import multer from 'multer';
import mongoose from 'mongoose';
import { loginValidator, postCreateValidator, registerValidator } from './validations/validations.js';

import checkAuth from './utils/checkAuth.js';
import { getAll, getLastTags, getOne, create, update, removeOne } from './controllers/PostController.js';
import { register, login, getMe } from './controllers/UserController.js';
import handleValidationErrors from './utils/handleValidationErrors.js';

mongoose
    .connect(
        process.env.MONGODB_URL ||
            'mongodb+srv://youzhnyfoto:Cfif1234@cluster0.ppu5twh.mongodb.net/?retryWrites=true&w=majority',
    )
    .then(() => console.log('db ok'))
    .catch((err) => console.log('db error', err));

const app = express();

app.get('/', (req, res) => {
    res.send('hello');
});

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads');
        }
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

app.use(cors());

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.post('/auth/login', loginValidator, handleValidationErrors, login);
app.post('/auth/register', registerValidator, handleValidationErrors, register);
app.get('/auth/me', checkAuth, getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `uploads/${req.file.originalname}`,
    });
});

app.get('/tags', getLastTags);

app.get('/posts', getAll);
app.get('/posts/tags', getLastTags);
app.get('/posts/:id', getOne);
app.post('/posts', checkAuth, postCreateValidator, handleValidationErrors, create);
app.patch('/posts/:id', checkAuth, postCreateValidator, handleValidationErrors, update);
app.delete('/posts/:id', checkAuth, removeOne);

app.listen(process.env.PORT || 4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Server OK');
});
