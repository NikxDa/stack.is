const mongoose = require ("mongoose")

const userSchema = new mongoose.Schema ({
    user:           { type: String, unique: true },
    userId:         { type: Number, unique: true },
    accessToken:    { type: String },
    statistics:     { type: mongoose.SchemaTypes.ObjectId, ref: "Statistics" }
});

module.exports = mongoose.model ("User", userSchema);