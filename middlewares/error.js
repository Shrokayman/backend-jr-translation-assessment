import { ErrorResponse } from "../utils/errorResponse.js";
import {LoggerService} from '../utils/loggerService.js'
export const errorHandler = (err, req, res, next) => {
  
  let error = { ...err };
  error.message = err.message;
  const logger = new LoggerService('Errors')
  logger.error(error.message,error)

  // Log to console for dev
  console.log("the error is: ", err);
  console.log(err.name)

  // Token expired or invalid
  if(err.name === "TokenExpiredError") {
    const message = "Please, make sure you are logged in recently.";
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    isSuccess: false,
    error: error.message || "Server Error",
  });
};
