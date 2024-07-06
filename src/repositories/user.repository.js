const UserModel = require("../models/user.model.js");

class UserRepository {
    async findByEmail(email) {
        try {
            return await UserModel.findOne({ email });
        } catch (error) {
            throw error;
        }
    }
    async findById(id) {
        try {
            return await UserModel.findById(id);
        } catch (error) {
            throw error;
        }
    }
    async findByIdAndUpdate(id, newRole) {
        try {
            return  await UserModel.findByIdAndUpdate(id, { role: newRole }, { new: true });
        } catch (error) {
            throw error;
        }
    }
    async create(user) {
        try {
            return await user.save();
        } catch (error) {
            throw error;
        }
    }
    async save(user) {
        try {
            return await user.save();
        } catch (error) {
            throw error;
        }
    }
    async findAll(id) {
        try {
            return await UserModel.find().select('first_name email role lastConnection');
        } catch (error) {
            throw error;
        }
    }
    async findAndDeleteInactiveUsers(days) {
        const dateLimit = new Date();
        dateLimit.setDate(dateLimit.getDate() - days);
        try {
            const usersDeleted = await UserModel.find({ lastConnection: { $lt: dateLimit } });
            const result = await UserModel.deleteMany({ lastConnection: { $lt: dateLimit } });
            return { result, usersDeleted };
        } catch (error) {
            throw error;
        }
    }
    async deleteById(id) {
        try {
            const userDelete = await UserModel.findByIdAndDelete(id);
            if (!userDelete) {
                return null;
            }
            return userDelete;
        } catch (error) {
            throw new Error("Error al eliminar usuario por ID");
        }
    }
}

module.exports = UserRepository;