import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

mongoose
    .connect('mongodb+srv://youzhnyfoto:Cfif1234@cluster0.ppu5twh.mongodb.net/?retryWrites=true&w=majority')
    .then(() => console.log('db ok'))
    .catch((err) => console.log('db error', err));

const app = express();

app.use(express.json());

app.post('/auth/register', (req, res) => {
    
});

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Server OK');
});
