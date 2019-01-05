const ErrorCodes = {
    UserExists:     new Error ("This user already exists."),
    UserNotFound:   new Error ("This user could not be found."),

    OAuthError:     new Error ("Error during OAuth validation."),

    Unexpected:     new Error ("An unexpected error occured. Sorry about that!"),
}

module.exports = ErrorCodes; 