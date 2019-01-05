const fetch = require ("node-fetch");
const Users = require ("../lib/Users");

module.exports = async (req, res) => {
    // Grab requested user
    const requestedUser = req.params.user.toLowerCase ();

    // Fetch the matching access token
    const userData = await Users.getUserByName (requestedUser);
    if (!userData) return res.redirect ("/");

    // Fetch the profile link
    const seUserData = StackExchange.getUserByAccessToken (userData.accessToken);

    // Extract the username
    const userLink = seUserData ["link"];
    if (!userLink) return res.redirect ("/");

    // Redirect
    res.redirect (userLink);
}