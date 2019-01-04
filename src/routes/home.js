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
    oAuthParams.append ("redirect_uri", "https://stack.is/");
    oAuthParams.append ("code", oAuthCode);

    const oAuthResponse = await fetch (oAuthValidationUrl, { method: "POST", body: oAuthParams });
    const oAuthData = await oAuthResponse.json ();

    // Grab access token
    const accessToken = oAuthData ["access_token"];
    if (!accessToken) {
        throw new Error (oAuthData ["error_message"]);
    }

    // Request and save user
    const userUrl = 
        `https://api.stackexchange.com/2.3/me?site=stackoverflow&access_token=${accessToken}&key=${process.env.OAUTH_APP_KEY}`;
    
    const seUserResponse = await fetch (userUrl);
    const seUserData = await seUserResponse.json ();

    // Check for errors
    if (seUserData ["error_id"]) {
        throw new Error (seUserData ["error_message"]);
    }

    // Extract the username
    const userName = seUserData ["items"][0]["link"].split ("/").pop ().toLowerCase ();
    
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
        try {
            const username = await verifyUser (oAuthCode);

            return res.render ("success", {
                shortLink: `https://stack.is/${username}`
            });
        } catch (err) {
            return res.render ("error", {
                errorMessage: err.message
            });
        }
    }

    // Build oAuth link
    const clientId = 14163;
    const oAuthUrl = "https://stackoverflow.com/oauth/";
    const redirectUrl = "https://stack.is/";
    
    const finalizedUrl = `${oAuthUrl}?client_id=${clientId}&scope=no_expiry&redirect_uri=${redirectUrl}`;
        
    // Render
    res.render ("home", { oAuthLink: finalizedUrl });
}