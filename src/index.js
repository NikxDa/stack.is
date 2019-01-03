// Require local packages
const fs = require ("fs");
const path = require ("path");

// Require external packages
const express = require ("express");
const handlebars = require ("express-handlebars");
const dotenv = require ("dotenv");

// Require custom modules
const routes = require ("./routes");

// Configure environment
dotenv.config ();

// Create the app
const app = express ();

// Initialize Handlebars
app.engine ("handlebars", handlebars ({ 
    defaultLayout: "main", 
    extname: ".handlebars",
    layoutsDir: path.join (__dirname, "views", "layouts")
}));

app.set ("views", path.join (__dirname, "views"));
app.set ("view engine", "handlebars");

// Allow access to public/ folder
const publicPath = path.join (__dirname, "public");
app.use ("/", express.static (publicPath));

// Define routes
app.get ("/", routes.home);
app.get ("/verify", routes.verify);

// Run the app
const serverPort = process.env.PORT || 3000;
app.listen (serverPort, err => {
    console.log (
        err
            ? `An error occured while launching the Stack.is server: ${err.message}`
            : `Stack.is server running on localhost:${serverPort}`
    );
});