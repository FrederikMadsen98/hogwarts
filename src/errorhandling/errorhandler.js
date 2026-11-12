
export default (err, req, res, next) => {

    // Opret variabler med default-værdier
    let statusCode = err.statusCode || 500;
    let error = err.error || "Internal Server Error";
    let message = err.message || "Something went wrong";

    // Find det rigtige error-navn
    if (statusCode == 400) {
        error = "Bad Request";
    } else if (statusCode == 401) {
        error = "Unauthorized";
    } else if (statusCode == 403) {
        error = "Forbidden";
    } else if (statusCode == 404) {
        error = "Not Found";
    } else if (statusCode == 405) {
        error = "Method Not Allowed";
    } else if (statusCode == 409) {
        error = "Conflict";
    } else if (statusCode == 422) {
        error = "Unprocessable Content";
    } else if (statusCode == 429) {
        error = "Too Many Requests";
    } else if (statusCode == 500) {
        error = "Internal Server Error";
    } else if (statusCode == 501) {
        error = "Not Implemented";
    } else if (statusCode == 502) {
        error = "Bad Gateway";
    } else if (statusCode == 503) {
        error = "Service Unavailable";
    }

    // Send response tilbage til klienten
    res.status(statusCode).json({
        message: message,
        error: error,
        statusCode: statusCode
    });
};
