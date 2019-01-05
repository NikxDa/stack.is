const StatisticsModel = require ("../models/StatisticsModel");

class Statistics {
    static async createStatistics (initialClicks = 0) {
        // Create statistics
        const statistics = new StatisticsModel ({
            clicks: initialClicks || 0
        });
        await statistics.save ();

        return statistics;
    }

    static async removeStatistics (statisticsId) {
        // Remove statistics
        await StatisticsModel.removeOne ({
            _id: statisticsId
        });
    }

    static async getStatisticsById (statisticsId) {
        // Find one statistics by id
        return await StatisticsModel.findOne ({
            _id: statisticsId
        });
    }

    static async trackVisit (statisticsId) {
        // Update the click count & the last visited date
        return await StatisticsModel.findOneAndUpdate ({
            _id: statisticsId
        }, {
            $inc: { visits: 1 },
            lastVisited: Date.now ()
        });
    }
}

module.exports = Statistics;