import express from 'express';
import mongoose from 'mongoose';
import { loginValidator, postCreateValidator, registerValidator } from './validations/validations.js';

import checkAuth from './utils/checkAuth.js';
import { getAll, getOne, create, update, removeOne } from './controllers/PostController.js';
import { register, login, getMe } from './controllers/UserController.js';

mongoose
    .connect('mongodb+srv://youzhnyfoto:Cfif1234@cluster0.ppu5twh.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('db ok'))
    .catch((err) => console.log('db error', err));

const app = express();

app.use(express.json());

app.post('/auth/login', loginValidator, login);

app.post('/auth/register', registerValidator, register);

app.get('/auth/me', checkAuth, getMe);

app.get('/posts', getAll);
app.get('/posts/:id', getOne);
app.post('/posts', checkAuth, postCreateValidator, create);
app.patch('/posts/:id', update);
app.delete('/posts/:id', removeOne);

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Server OK');
});
