// Sending response with status code and data
export const dataResponse = (res, statusCode, data) => {
    res.status(statusCode).send({ isSuccess: true, data })
};

// Sending response with status code and message
export const messageResponse = (res, statusCode, message) => {
    res.status(statusCode).send({ isSuccess: true, message });
};