module.exports = basicAuth;

/**
 * Checks authentication (for username=webhookUsername and password=webhookPassowrd)
 *
 */
async function basicAuth(req, res, next) {
    const { headers, path } = req;

    // Make authenticate path public
    if (path !== '/webhooks') {
        return next();
    }

    // Check for basic auth header
    const authHeader = headers.authorization;
    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return res.status(401).json({ message: 'Missing Authorization Header' });
    }

    // Verify auth credentials
    const encodedCredentials = authHeader.replace('Basic ', '');
    const decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString();
    const [username, password] = decodedCredentials.split(':');
    if (username !== 'webhookUsername' || password !== 'webhookPassword') {
        return res.status(401).json({ message: 'Invalid Authentication Credentials' });
    }

    next();
}
