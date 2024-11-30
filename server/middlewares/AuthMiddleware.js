const { verify } = require('jsonwebtoken');

// Middleware to validate the JWT access token
const validateToken = (req, res, next) => {
    // Retrieve the access token from the request header
    const accessToken = req.header("accessToken");

    // If no token is provided, send an error response
    if (!accessToken) return res.json({ error: "User not logged in" });

    try {
        // Verify the token using the secret key
        const validToken = verify(accessToken, "importantsecret");

        if (validToken) {
            // Attach the decoded token (user data) to the request object
            req.user = validToken;
            return next(); // Allow the request to proceed to the next middleware or route handler
        }
    } catch (err) {
        // Handle token verification errors (e.g., expired or invalid token)
        return res.json({ error: err.message });
    }
};

// Export the middleware function for use in routes
module.exports = { validateToken };
