import { ErrorResponse } from '../utils/errorResponse.js';
import { User } from '../models/User.js';
import { dataResponse, messageResponse } from '../utils/successResponses.js';
import { asyncHandler } from '../middlewares/async.js';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

// asyncHandler is used to handle try and catch operations

export const register = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body)
    if (!user)
        return next(new ErrorResponse("Details are not correct", 409));
    const token = generateToken(user)
    res.cookie('token', token, { httpOnly: true, sameSite: 'strict', secure: false });
    const data = {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
    }
    dataResponse(res, 201, data)
})

export const login = asyncHandler(async (req, res, next) => {
    const { usernameOrEmail, password } = req.body
    if (!usernameOrEmail || !password)
        return next(new ErrorResponse("Content can not be empty!", 400));
    let user = await User.findOne({ where: { username: usernameOrEmail } });
    if (!user)
        user = await User.findOne({ where: { email: usernameOrEmail } });
    if (!user)
        return next(new ErrorResponse("Authentication failed", 401));
    const isSame = await bcrypt.compare(password, user.password);
    if (!isSame)
        return next(new ErrorResponse("Authentication failed", 401));
    const token = generateToken(user)
    res.cookie('token', token, { httpOnly: true, sameSite: 'strict', secure: false });
    const data = {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
    }
    dataResponse(res, 201, data)
})

function generateToken(user) {
    let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY,
    });
    return token;
}