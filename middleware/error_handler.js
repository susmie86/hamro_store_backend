module.exports = (func) => {
    return (req, res, next) => {
        func(req, res, next)
            .catch((error) => {

                console.log("Error here: ");
                console.log(error);

                console.log("Request here: ");
                // console.log(req);

                console.log("Responsose here.");
                // console.log(res);
                if (typeof error === 'string') {
                    // Handle custom error messages with a 400 status code
                    res.status(400).json({ "status": "error", "message": [error], "data": null });
                } else if (error.code === 'VALIDATION_ERROR') {
                    // Handle validation errors with a 422 status code (Unprocessable Entity)
                    res.status(422).json({ "status": "error", "message": error.message, "data": null });
                } else {
                    // Handle other errors with a 500 status code (Internal Server Error)
                    res.status(500).json({ "status": "error", "message": "Internal server error", "data": null });
                }
            });
    };
}
