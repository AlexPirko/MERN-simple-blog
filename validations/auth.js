import { body } from 'express-validator';

export const registerValidator = [
    body('email', 'Wrong email format').isEmail(),
    body('password', 'The password must contain a minimum of 5 characters').isLength({ min: 5 }),
    body('name', 'The name must contain a minimum of 3 characters').isLength({ min: 3 }),
    body('avatarUrl', 'Wrong URL format').optional().isURL(),
];
