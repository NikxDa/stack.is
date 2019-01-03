// Import all routes
const homeRoute = require ("./home");
const verifyRoute = require ("./verify");

// Re-export
module.exports = {
    home: homeRoute,
    verify: verifyRoute
};