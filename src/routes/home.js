const fetch = require ("node-fetch");
const { URLSearchParams } = require ("url");
const UserModel = require ("../models/UserModel");

async function verifyUser (oAuthCode) { 
    // Grab oAuth data from environment
    const clientId = process.env.OAUTH_CLIENT_ID;
    const clientSecret = process.env.OAUTH_CLIENT_SECRET;

    // Validate oAuth values
    if (!clientId || !clientSecret)
        return false;

    // Now send the code to StackExchange for validation
    const oAuthValidationUrl = 
        `https://stackoverflow.com/oauth/access_token/json`;

    const oAuthParams = new URLSearchParams ();
    oAuthParams.append ("client_id", clientId);
    oAuthParams.append ("client_secret", clientSecret);
    oAuthParams.append ("code", oAuthCode);

    const oAuthResponse = await fetch (oAuthValidationUrl, { method: "POST", body: oAuthParams });
    const oAuthData = await oAuthResponse.json ();

    // Grab access token
    const accessToken = oAuthData ["access_token"];
    if (!accessToken) {
        return res.render ("error", {
            errorMessage: oAuthData ["error_message"]
        });
    }

    // Request and save user
    const userUrl = 
        `https://api.stackoverflow.com/2.3/me?site=stackoverflow&access_token=${accessToken}&key=${process.env.OAUTH_APP_KEY}`;
    
    const userResponse = await fetch (userUrl);
    const userData = await userResponse.json ();

    // Check for errors
    if (userData ["error_id"]) {
        return res.render ("error", {
            errorMessage: userData ["error_message"]
        });
    }

    // Extract the username
    const userName = userData ["items"][0]["link"].split ("/").pop ().toLowerString ();
    
    // Save the data
    const userData = new UserModel ({
        user: userName, 
        accessToken
    });
    userData.save ();

    // Return username
    return userName;
}

module.exports = async (req, res) => {
    // Grab code from result
    const oAuthCode = req.query.code;
    if (oAuthCode) {
        const username = await verifyUser (oAuthCode);
        return res.render ("success", {
            shortLink: `https://stack.is/${username}`
        });
    }

    // Build oAuth link
    const clientId = 14163;
    const oAuthUrl = "https://stackoverflow.com/oauth/dialog";
    const redirectUrl = "https://stack.is/";
    
    const finalizedUrl = `${oAuthUrl}?client_id=${clientId}&scope=no_expiry&redirect_uri=${redirectUrl}`;
        
    // Render
    res.render ("home", { oAuthLink: finalizedUrl });
}