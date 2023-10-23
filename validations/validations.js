import { body } from 'express-validator';

export const loginValidator = [
    body('email', 'Wrong email format').isEmail(),
    body('password', 'The password must contain a minimum of 5 characters').isLength({ min: 5 }),
];

export const registerValidator = [
    body('email', 'Wrong email format').isEmail(),
    body('password', 'The password must contain a minimum of 5 characters').isLength({ min: 5 }),
    body('name', 'The name must contain a minimum of 3 characters').isLength({ min: 3 }),
    body('avatarUrl', 'Wrong URL format').optional().isURL(),
];

export const postCreateValidator = [
    body('title', 'Enter article title').isLength({ min: 3 }).isString(),
    body('text', 'Enter article text').isLength({ min: 10 }).isString(),
    body('tags', 'Invalid tag format').optional().isArray(),
    body('imageUrl', 'Wrong image-url link').optional().isString(),
];
