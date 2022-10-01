import {body} from 'express-validator';

export const loginValidator = [
    body('email','Неверный формат почты').isEmail(),
    body('password' ,' Минимум 5 символов').isLength({min:5}),
]