const User = require("../controller/User");

module.exports.login = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;

    try {
        const userInstance = new User();
        const response = await userInstance.login(JSON.parse(event.body));

        return {
            statusCode: 200,
            body: JSON.stringify(response)
        }
    } catch (err) {
        return {
            statusCode: err.statusCode || 500,
            headers: { "Content-Type": "application/json" },
            body: {
                status: "error",
                message: err.message
            }
        }
    }
}

module.exports.validate = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;

    try {
        const userInstance = new User();
        const response = await userInstance.validate(JSON.parse(event.body));

        return {
            statusCode: 200,
            body: JSON.stringify(response)
        }
    } catch (err) {
        return {
            statusCode: err.statusCode || 500,
            headers: { "Content-Type": "application/json" },
            body: {
                status: "error",
                message: err.message
            }
        }
    }
}