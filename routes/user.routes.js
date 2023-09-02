import express from 'express';
import {
    register,
    login,
    requestResetPassword,
    resetPassword
} from '../controllers/user.controller.js';
import { ApiRateLimiter } from '../middlewares/attempts.js'
import { checkDuplicateUsernameOrEmail } from '../middlewares/verifySignUp.js';

const userRouter = express.Router();

userRouter.post('/register', ApiRateLimiter, checkDuplicateUsernameOrEmail, register)
userRouter.post('/login', ApiRateLimiter, login)
userRouter.post('/requestResetPassword', ApiRateLimiter, requestResetPassword)
userRouter.post('/resetPassword', ApiRateLimiter, resetPassword)

export { userRouter };