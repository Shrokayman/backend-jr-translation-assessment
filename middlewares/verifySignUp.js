import { User } from '../models/User.js';
import { ErrorResponse } from '../utils/errorResponse.js';
import { asyncHandler } from '../middlewares/async.js';

export const checkDuplicateUsernameOrEmail = asyncHandler(async (req, res, next) => {
    const { name, email, username, password } = req.body
    if (!name || !email || !username || !password)
        return next(new ErrorResponse("Content can not be empty!", 400));
    const usernameExists = await User.findOne({ where: { username } });
    if (usernameExists)
        return next(new ErrorResponse("username already taken", 409));
    const emailExists = await User.findOne({ where: { email } });
    if (emailExists)
        return next(new ErrorResponse("email already taken", 409));
    next();
});