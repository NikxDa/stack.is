const Users = require ("../lib/Users");
const StackExchange = require ("../lib/StackExchange");

async function verifyUser (oAuthCode) { 
    // Check that there is an OAuth code
    if (!oAuthCode)
        throw new Error ("No OAuth Code found.");

    // Now send the code to StackExchange for validation
    const accessToken = await StackExchange.verifyOAuth (oAuthCode);

    // Request user data
    const seUserData = await StackExchange.getUserByAccessToken (accessToken);

    // Extract the user data
    const userName = seUserData ["link"].split ("/").pop ().toLowerCase ();
    const userId = Number (seUserData ["user_id"]);

    // Does a user with this ID exist?
    const existingUser = await Users.getUserById (userId);
    if (existingUser) {
        // A user with this ID exists, has the username changed?
        if (userName !== existingUser.user) {
            // Update the old entry
            await Users.updateUserById (userId, {
                user: userName,
                accessToken: accessToken
            });
            return userName;
        } 

        // Update the acceess token
        await Users.updateUserById (userId, {
            accessToken: accessToken
        });

        // Throw "UserExists" error
        throw new Error ("This user already exists");
    }

    // Save the data
    Users.createUser (userName, userId, accessToken);

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

    // Build OAuth link
    const oAuthLink = StackExchange.getOAuthLink ();

    // Render
    res.render ("home", { oAuthLink: oAuthLink });
}