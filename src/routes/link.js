const UserModel = require ("../models/UserModel");

module.exports = async (req, res) => {
    // Grab requested user
    const requestedUser = req.params.user.toLowerString ();

    // Fetch the matching auth token
    const userData = await UserModel.find ({ user: requestedUser });
    if (!userData) return res.redirect ("/");

    // Fetch the profile link
    const userUrl = 
        `https://api.stackoverflow.com/2.3/me?site=stackoverflow&access_token=${userData.accessToken}&key=${process.env.OAUTH_APP_KEY}`;

    const seUserResponse = await fetch (userUrl);
    const seUserData = await seUserResponse.json ();

    // Check for errors
    if (seUserData ["error_id"]) {
        return res.render ("error", {
            errorMessage: seUserData ["error_message"]
        });
    }

    // Extract the username
    const userLink = seUserData ["items"][0]["link"];
    if (!userLink) return res.redirect ("/");

    // Redirect
    res.redirect (userLink);
}