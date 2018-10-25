module.exports = {
    success: function success(message, data) {
        return {
            type: 'data',
            message,
            ...data,
            datetime: new Date(),
        };
    },
    deny: function deny(message) {
        return {
            type: 'deny',
            message,
            datetime: new Date(),
        };
    },
    error: function error(error) {
        return {
            type: 'error',
            error,
            datetime: new Date(),
        };
    },
};
