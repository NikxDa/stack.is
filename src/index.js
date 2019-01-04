// Require local packages
const fs = require ("fs");
const path = require ("path");

// Require external packages
const express = require ("express");
const handlebars = require ("express-handlebars");
const dotenv = require ("dotenv");
const mongoose = require ("mongoose");

// Require custom modules
const routes = require ("./routes");

// Configure environment
dotenv.config ({
    path: path.join (__dirname, "..", ".env")
});

// Connect to Mongoose
mongoose.Promise = global.Promise;
mongoose.connect (`mongodb://${process.env.MONGO_HOST}:27017/${process.env.MONGO_DB}`, {
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASS,
    useNewUrlParser: true
}, err => {
    console.log (
        err 
            ? `Error while connecting to database: "${err.message}"`
            : `Successfully connected to database on ${process.env.MONGO_HOST}:27017`  
    );
    
    // Quit if a database connection could not be established
    if (err) process.exit ();
});

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
app.get ("/:user", routes.link);

// Run the app
const serverPort = process.env.PORT || 3000;
app.listen (serverPort, err => {
    console.log (
        err
            ? `An error occured while launching the Stack.is server: ${err.message}`
            : `Stack.is server running on localhost:${serverPort}`
    );
});