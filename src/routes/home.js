module.exports = (req, res) => {
    // Get oAuth link
    const clientId = 14163;
    const oAuthUrl = "https://stackoverflow.com/oauth/dialog";
    const redirectUrl = "https://stack.is/verify";
    
    const finalizedUrl = `${oAuthUrl}?client_id=${clientId}&scope=no_expiry&redirect_uri=${redirectUrl}`;
        
    // Render
    res.render ("home", { oAuthLink: finalizedUrl });
}