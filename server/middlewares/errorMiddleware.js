class ErrorHandler extends Error {
    constructor(massage, statusCode) {
        super(massage);
        this.statusCode = statusCode;
    }
}

export const errorMiddlewere = (err, req, res, next) => {
    err.massage = err.massage || "internal server error";
    err.statusCode = err.statusCode || 500;

    if (err.code === 11000) {
        const massage = 'Duplicate field value entered';
        err = new ErrorHandler(massage, 400);
    }

    if ((err.name === "JsonWebTokenError")) {
        const massage = "Json Web Token is invalid, try again";
        err = new ErrorHandler(massage, 400);
    }

    if (err.name === "TokenExpiredError") {
        const massage = "JSON Web Token has expired, try again";
        err = new ErrorHandler(massage, 400);
    }

    const errorMessage = err.errors
        ? Object.values(err.errors)
            .map((error) => error.message)
            .join(" ")
        : err.message;
        
    return res.status(err.statusCode).json({
        success: false,
        message: errorMessage,
    });
};

export default ErrorHandler;