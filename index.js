import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { validationResult } from 'express-validator';

import { registerValidator } from './validations/auth.js';
import UserSchema from './models/User.js';

mongoose
    .connect('mongodb+srv://youzhnyfoto:Cfif1234@cluster0.ppu5twh.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('db ok'))
    .catch((err) => console.log('db error', err));

const app = express();

app.use(express.json());

app.post('/auth/login', async (req, res) => {
    try {
        const user = await UserSchema.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({
                message: "User don't found",
            });
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if (!isValidPass) {
            return res.status(400).json({
                message: 'Wrong login or password',
            });
        }

        const token = jwt.sign(
            {
                _id: user._id,
            },
            'secret11',
            {
                expiresIn: '30d',
            },
        );

        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to authorisation',
        });
    }
});

app.post('/auth/register', registerValidator, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserSchema({
            name: req.body.name,
            email: req.body.email,
            passwordHash: hash,
            avatarUrl: req.body.avatarUrl,
        });

        const user = await doc.save();

        const token = jwt.sign(
            {
                _id: user._id,
            },
            'secret11',
            {
                expiresIn: '30d',
            },
        );

        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to register',
        });
    }
});

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Server OK');
});
