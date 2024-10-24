const GenerateResponse = (httpStatus, message, data, error) => {
    const res = {
        status: httpStatus,
        message: message,
        data: data,
        error: error
    }

    return res;
}

module.exports = {
    GenerateResponse
}