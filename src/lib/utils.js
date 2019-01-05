function normalizeName (user) {
    return user
        .toLowerCase ()                 // Make lowercase
        .replace (/[^a-z0-9]/g, "-")    // Replace all invalid characters with dashes
        .replace (/-{2,}/g, "-")        // Remove multiple dashes
        .replace (/(^-|-$)/g, "")       // Remove dashes at the start or end
}

function incrementName (user) {

}

module.exports = {
    normalizeName
}