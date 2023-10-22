import express from 'express';
import mongoose from 'mongoose';
import { registerValidator } from './validations/auth.js';

import checkAuth from './utils/checkAuth.js';
import { register, login, getMe } from './controllers/UserController.js';


mongoose
    .connect('mongodb+srv://youzhnyfoto:Cfif1234@cluster0.ppu5twh.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('db ok'))
    .catch((err) => console.log('db error', err));

const app = express();

app.use(express.json());

app.post('/auth/login', login);

app.post('/auth/register', registerValidator, register);

app.get('/auth/me', checkAuth, getMe);

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Server OK');
});
