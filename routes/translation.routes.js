import express from 'express';
import {
    translate,
    getTranslationHistory
} from '../controllers/translation.controller.js';
import { userAuth } from '../middlewares/verifyToken.js';
import { ApiRateLimiter } from '../middlewares/attempts.js';

const translationRouter = express.Router();

translationRouter.post('/', ApiRateLimiter, userAuth, translate)
translationRouter.get('/', ApiRateLimiter, userAuth, getTranslationHistory)

export { translationRouter }