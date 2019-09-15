var ErrorCode = {
    success: number = 200,
    // notSave: number = ,
    badRequest: number = 400,
    unauthorised: number = 401,
    paymentRequired: number = 402,
    sessionExpired: number = 403,
    notFound: number = 404,
    conflict: number = 409,
    gone: number = 410,
    noResponse: number = 444,
    internalServerError: number = 500,
    serviceUnavailable: number = 503
};
exports.ErrorCode = ErrorCode;

var ErrorMessages = {
    badParams: string = "Bad params request.",
    internalServer: string = "Something went wrong, Please try again later."
}
exports.ErrorMessages = ErrorMessages;
