const mongoose = require ("mongoose")

const userSchema = new mongoose.Schema ({
    user:           { type: String, unique: true },
    accessToken:    { type: String }
});

module.exports = mongoose.model ("User", userSchema);