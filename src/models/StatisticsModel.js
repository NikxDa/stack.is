const mongoose = require ("mongoose")

const statisticsSchema = new mongoose.Schema ({
    visits:         { type: Number, default: 0 },
    lastVisited:    { type: Date }
});

module.exports = mongoose.model ("Statistics", statisticsSchema);