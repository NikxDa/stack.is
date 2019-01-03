const createLinkButton = document.getElementById ("createLinkButton");
const stackExchange = new StackExchange ();

if (createLinkButton)
    createLinkButton.addEventListener ("click", () => stackExchange.oAuthDialog ());

if (window.location.hash) {
    const token = stackExchange.validateOAuth ();
    alert (token);
}