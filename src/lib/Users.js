const UserModel = require ("../models/UserModel");
const Statistics = require ("../lib/Statistics");

class Users {
    static async createUser (userName, userId, accessToken) {
        // Create statistics first
        const statistics = await Statistics.createStatistics ();

        // Now, create user
        const user = new UserModel ({
            user: userName,
            userId,
            accessToken,
            statistics: statistics._id
        });
        await user.save ();
    }

    static async removeUser (userId) {
        // Remove user
        await UserModel.removeOne ({
            userId
        });
    }

    static async getUserById (userId) {
        // Find one user by id
        return await UserModel.findOne ({
            userId
        });
    }

    static async getUserByName (userName) {
        // Find one user by name
        return await UserModel.findOne ({
            user: userName
        });
    }

    static async updateUserById (userId, updatedData) {
        // Update one user by id
        return await UserModel.findOneAndUpdate ({
            userId
        }, updatedData);
    }
}

module.exports = Users;