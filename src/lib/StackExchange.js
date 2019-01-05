const fetch = require ("node-fetch");

class StackExchange {
    static staticConstructor () {
        this.clientId = process.env.OAUTH_CLIENT_ID;
        this.clientSecret = process.env.OAUTH_CLIENT_SECRET;
        this.applicationKey = process.env.OAUTH_APP_KEY;
        this.baseUrl = "https://api.stackexchange.com/2.2/";
    }

    static async getUserByAccessToken (accessToken) {
        const userUrl = 
            `https://api.stackexchange.com/2.3/me?site=stackoverflow&access_token=${accessToken}&key=${this.applicationKey}`;

        try {
            // Fetch and parse user data
            const seUserResponse = await fetch (userUrl);
            const seUserData = await seUserResponse.json ();

            // Check for errors
            if (seUserData ["error_id"]) 
                throw new Error (seUserData ["error_message"]);
            
            // Return the first item
            return seUSerData ["items"][0];
        } catch (err) {
            throw new Error ("Could not fetch user data.");
        }
    }

    static async getAvailableSites () {
        // Grab sites from API
        const sitesResponse = await fetch (this.baseUrl + "sites");
        const sitesJson = await sitesResponse.json ();

        // 
        const availableSites = sitesJson ["items"].map (itm => ({
            name:       itm ["name"],
            shortName:  itm ["api_site_parameter"],
            iconUrl:    itm ["icon_url"],
            siteUrl:    itm ["site_url"],
        }));

        return availableSites;
    }

    static getOAuthLink () {
        const oAuthUrl = "https://stackoverflow.com/oauth/";
        const redirectUrl = "https://stack.is/";

        const finalizedUrl = `${oAuthUrl}?client_id=${process.env.OAUTH_CLIENT_ID}&scope=no_expiry&redirect_uri=${redirectUrl}`;
        return finalizedUrl;
    }

    static async verifyOAuth (oAuthCode) {
        const oAuthValidationUrl = 
            `https://stackoverflow.com/oauth/access_token/json`;

        const oAuthParams = new URLSearchParams ();
        oAuthParams.append ("client_id", process.env.OAUTH_CLIENT_ID);
        oAuthParams.append ("client_secret", process.env.OAUTH_CLIENT_SECRET);
        oAuthParams.append ("redirect_uri", "https://stack.is/");
        oAuthParams.append ("code", oAuthCode);

        const oAuthResponse = await fetch (oAuthValidationUrl, { method: "POST", body: oAuthParams });
        const oAuthData = await oAuthResponse.json ();

        // Grab access token
        const accessToken = oAuthData ["access_token"];
        if (!accessToken) {
            throw new Error (oAuthData ["error_message"]);
        }

        return accessToken;
    }
}

// Call static constructor for initial static values
StackExchange.staticConstructor ();

// Export
module.exports = StackExchange;