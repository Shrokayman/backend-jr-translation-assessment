import { ErrorResponse } from '../utils/errorResponse.js';
import { User } from '../models/User.js';
import { dataResponse } from '../utils/successResponses.js';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { sendEmail } from '../utils/Emails.js';
import { asyncHandler } from '../middlewares/async.js'; //Used to handle try catch operations

export const register = asyncHandler(async (req, res, next) => {
    // The validations is seperated in a middleware
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

export const requestResetPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body
    const user = await User.findOne({ where: { email } })
    if (!user)
        return next(new ErrorResponse("This user is not exist", 404));
    const resetPasswordOtp = generateOTP(6);
    await user.update({ resetPasswordOtp })
    const emailData = {
        email: user.email,
        subject: 'Your password reset link',
        isHtml: true,
        template: 'forget_password',
        context: {
            name: user.name,
            reset_link: '' + process.env.RESET_PASSWORD_PAGE + '?email=' + user.email + '&code=' + resetPasswordOtp + '',
        },
    }
    sendEmail(emailData)
    res.status(201).json({ isSuccess: true, message: "Check your mail to reset your password" })
})

export const resetPassword = asyncHandler(async (req, res, next) => {
    const { email, password, code } = req.body
    const user = await User.findOne({ where: { email } })
    if (!user)
        return next(new ErrorResponse("This user is not exist", 404));
    if (user.resetPasswordOtp !== code)
        return next(new ErrorResponse("Invalid OTP", 400))
    await user.update({ password })
    res.status(201).json({ isSuccess: true, message: "Your password has been reset successfuly" })
})

// -------------------------------helper metshod-------------------------------
function generateToken(user) {
    let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY,
    });
    return token;
}
function generateOTP(otpLength) {
    var digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < otpLength; i++)
        OTP += digits[Math.floor(Math.random() * 10)];
    return OTP;
}