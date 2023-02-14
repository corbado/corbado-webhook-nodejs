const assert = require('assert');
const UserDatabase = require('./UserDatabase');

const WEBHOOK_ACTION = {
    AUTH_METHODS: 'authMethods',
    PASSWORD_VERIFY: 'passwordVerify'
};

const ALLOWED_STATUS = ['exists', 'not_exists', 'blocked'];

exports.handleWebhook = async (req, res) => {

    const userDatabase = new UserDatabase();

    // Check if request has been made with POST. For Corbado webhooks
    // only POST is allowed/used.
    if (!isPost(req)) {
        return res.status(405).send('Method Not Allowed');
    }

    const webhookAction = getAction(req);

    try {
        // Get the webhook action and act accordingly. Every Corbado
        // webhook has an action.
        switch (webhookAction) {

            // Handle the "authMethods" action which basically checks
            // if a user exists on your side/in your database.
            case WEBHOOK_ACTION.AUTH_METHODS: {
                const request = getAuthMethodsRequest(req);

                // Now check if the given user/username exists in your
                // database and send status. Implement getUserStatus()
                // function below.
                const status = await userDatabase.getUserStatus(request.data.username);
                sendAuthMethodsResponse(status, res);
                break;
            }

            // Handle the "passwordVerify" action which basically checks
            // if the given username and password are valid.
            case WEBHOOK_ACTION.PASSWORD_VERIFY: {
                const request = getPasswordVerifyRequest(req);

                // Now check if the given username and password is
                // valid. Implement verifyPassword() function below.
                if (await userDatabase.verifyPassword(request.data.username, request.data.password) === true) {
                    sendPasswordVerifyResponse(true, res);
                } else {
                    sendPasswordVerifyResponse(false, res);
                }
                break;
            }

            default: {
                return res.status(400).send('Bad Request');
            }
        }
    } catch (error) {

        // We expose the full error message here. Usually you would
        // not do this (security!) but in this case Corbado is the
        // only consumer of your webhook. The error message gets
        // logged at Corbado and helps you and us debugging your
        // webhook.
        console.log(error);

        // If something went wrong just return HTTP status
        // code 500. For successful requests Corbado always
        // expects HTTP status code 200. Everything else
        // will be treated as error.
        return res.status(500).send(error.message);
    }

}

/**
 * Checks if request method is POST (the only supported method from Corbado)
 *
 * @return {boolean}
 */
function isPost(req) {
    return req.method === 'POST';
}

/**
 * Returns webhook action (by reading the header field X-Corbado-Action)
 *
 * @return {Object}
 */
function getAction(req) {

    const corbadoAction = req.get('X-Corbado-Action') || '';

    if (!corbadoAction) {
        throw new Error('Missing action header (X-CORBADO-ACTION)');
    }

    switch (corbadoAction) {
        case WEBHOOK_ACTION.AUTH_METHODS:
            return WEBHOOK_ACTION.AUTH_METHODS;

        case WEBHOOK_ACTION.PASSWORD_VERIFY:
            return WEBHOOK_ACTION.PASSWORD_VERIFY;

        default:
            throw new Error(`Invalid action ("${corbadoAction}")`);
    }
}

/**
 * Returns auth methods request model
 *
 * @param {Object} req
 * @return {object}
 */
function getAuthMethodsRequest(req) {
    const data = req.body;

    assert.ok(data.id, 'Missing id field');
    assert.ok(data.projectID, 'Missing projectID field');
    assert.ok(data.action === WEBHOOK_ACTION.AUTH_METHODS, `Unexpected action: ${data.action}`);
    assert.ok(data.data.username, 'Missing username field');

    return {
        id: data.id,
        projectID: data.projectID,
        action: data.action,
        data: {
            username: data.data.username,
        },
    };
}

/**
 * Sends auth methods response
 *
 * @param {string} status
 * @param {Object} res
 * @param {string} responseID
 */
function sendAuthMethodsResponse(status, res, responseID = '') {
    if (!ALLOWED_STATUS.includes(status)) {
        throw new Error('Invalid status value');
    }

    const response = {
        responseID,
        data: {status}
    };

    sendResponse(response, res);
}

/**
 * Returns password verify request model
 *
 * @param {Object} req
 * @return {Object}
 */
function getPasswordVerifyRequest(req) {
    const data = req.body;
    const requiredFields = ['id', 'projectID'];
    const requiredDataKeys = ['username', 'password'];

    if (!requiredFields.every(key => key in data) || !requiredDataKeys.every(key => key in data.data)) {
        throw new Error('Invalid request format');
    }

    return {
        id: data.id,
        projectID: data.projectID,
        action: WEBHOOK_ACTION.PASSWORD_VERIFY,
        data: {
            username: data.data.username,
            password: data.data.password
        }
    };
}

/**
 * Sends password verify response
 *
 * @param {boolean} success
 * @param {Object} res
 * @param {string} responseID
 */
function sendPasswordVerifyResponse(success, res, responseID = '') {
    const response = {
        responseID: responseID,
        data: {success}
    };

    sendResponse(response, res);
}


/**
 * Sends response
 *
 * @param {Object} response
 * @param {Object} res
 */
function sendResponse(response, res) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.send(JSON.stringify(response));
}