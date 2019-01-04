// Import all routes
const homeRoute = require ("./home");
const linkRoute = require ("./link");

// Re-export
module.exports = {
    home: homeRoute,
    link: linkRoute
};