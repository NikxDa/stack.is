class StackExchange {
    constructor () {
        this.clientId = 14163;
        this.oAuthUrl = "https://stackoverflow.com/oauth/dialog";
        this.redirectUrl = "https://stack.is/verify";
    }

    oAuthDialog () {
        // Build the final URL
        const finalizedUrl = `${this.oAuthUrl}?client_id=${this.clientId}&scope=no_expiry&redirect_uri=${this.redirectUrl}`;
        // const windowOptions = "width=450,height=600,menubar=0,toolbar=0";

        // Open confirmation window
        window.location = finalizedUrl;
    }

    validateOAuth () {
        const documentHash = document.location.hash.substr (1);
        const urlParams = new URLSearchParams (documentHash);

        // Has there been an error?
        const error = urlParams.get ("error");
        if (error) return false;

        // Grab the access token
        const accessToken = urlParams.get ("access_token");
        if (!accessToken) return false;

        // Now send access token to server
        fetch ("/")

        return accessToken;
    }
}

tippy ("button", { placement: "bottom", content: "You will be redirected to StackExchange to confirm.", theme: "light-border", arrow: true });