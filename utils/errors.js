const express = require('express');

express.response.error = function(error) {
    if (!error.code) {
        error = {
            message: error.toString(),
            code: 'server_error',
            status: 500
        };
    }

    this.status(error.status).send(error);
};

module.exports = {
    emptyData: {
        message: 'Data is empty',
        code: 'empty_data',
        status: 401
    },
    undefinedData: {
        message: 'Data is undefined',
        code: 'undefined_data',
        status: 402
    },
    accessDenied: {
        message: 'Access denied',
        code: 'access_denied',
        status: 403
    },
    wrongCredentials: {
        message: 'Email or password are wrong',
        code: 'wrong_credentials',
        status: 405
    },
    userBlocked: {
        message: 'You have been blocked by the Administrator',
        code: 'user_blocked',
        status: 406
    },
    validPassword: {
        message: 'Password length must be at least six characters',
        code: 'password_length',
        status: 407
    }
  /*  deleteAdmin: {
        message: 'Удаление пользователя невозможно',
        code: 'delete_is impossible',
        status: 402
    },
    blockAdmin: {
        message: 'Блокировка пользователя невозможна',
        code: 'block_is impossible',
        status: 403
    },
    invalidId: {
        message: 'Bad request',
        code: 'bad_request',
        status: 405
    },
    notFound: {
        message: 'Entity not found',
        code: 'entity_not_found',
        status: 404
    },
    wrongCredentials: {
        message: 'Email or password are wrong',
        code: 'wrong_credentials',
        status: 406
    },
    accessDenied: {
        message: 'Access denied',
        code: 'access_denied',
        status: 407
    },
        Unauthorized: {
        message: 'Unauthorized',
        code: 'unauthorized',
        status: 408
    },
    PaymentRequired: {
        message: 'Payment Required',
        code: 'payment_equired',
        status: 409
    }
*/
};