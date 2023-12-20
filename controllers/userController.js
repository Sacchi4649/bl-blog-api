"use strict";

const userModel = require("../models/userSchema");
const { generateToken, verifyToken } = require("../utils/jwtHandler");
const {
  passwordEncryption,
  passwordValidation,
} = require("../utils/passwordHandler");

class UserController {
  static async createUser(req, res, next) {
    try {
      const { username, email, password, confirmPassword, role } = req.body;
      const user = new userModel({
        username,
        email,
        password: passwordEncryption(password),
        role,
      });

      const checkUsername = await userModel.findOne({
        username: username,
      });

      const checkEmail = await userModel.findOne({
        email: email,
      });

      if (checkUsername) {
        throw {
          name: "ConflictError",
          message: "Username is already exist!",
        };
      }

      if (checkEmail) {
        throw {
          name: "ConflictError",
          message: "Email is already exist!",
        };
      }

      if (!(password == confirmPassword)) {
        throw {
          name: "BadRequestError",
          message: "Password does not match!",
        };
      }

      await user.save();
      res.status(200).json({ user: user });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { username, password } = req.body;

      const findUsername = await userModel.findOne({ username: username });
      if (findUsername) {
        if (passwordValidation(password, findUsername.password)) {
          res.status(200).json({
            message: "Login success!",
            token: generateToken({
              id: findUsername._id,
              username: findUsername.username,
              email: findUsername.email,
              role: findUsername.role,
            }),
          });
        } else {
          res.status(400).json({ message: "Username/Password wrong!" });
        }
      } else {
        res.status(400).json({ message: "Username/Password wrong!" });
      }
    } catch (error) {
      next(error);
    }
  }

  static async getAllUser(req, res, next) {
    try {
      const { limit = 10, offset = 0, search = "" } = req.query;
      const findUser = await userModel.find({
        $or: [
          { username: { $regex: new RegExp(search, "i") } },
          { email: { $regex: new RegExp(search, "i") } },
          { role: { $regex: new RegExp(search, "i") } },
        ],
      });

      const count = await userModel
        .find({
          $or: [
            { username: { $regex: new RegExp(search, "i") } },
            { email: { $regex: new RegExp(search, "i") } },
            { role: { $regex: new RegExp(search, "i") } },
          ],
        })
        .count();

      const pagination = {
        page: offset ? offset / limit + 1 : 1,
        per_page: limit * 1,
        total_data: count,
      };
      res.status(200).json({ user: findUser, pagination });
    } catch (error) {
      next(error);
    }
  }

  static async editUser(req, res, next) {
    try {
      const { userId } = req.params;
      const { username, email, role } = req.body;
      const findUser = await userModel.findOne({ _id: userId });
      const checkEmail = await userModel.findOne({ email: email });
      if (!findUser) {
        throw { name: "BadRequestError", message: "User not found!" };
      }
      if (checkEmail) {
        throw {
          name: "BadRequestError",
          message: "Email is already exist!",
        };
      }
      if (findUser)
        if (findUser._id == userId) {
          const updateUser = await userModel.findOneAndUpdate(
            {
              _id: userId,
            },
            { username, email, role },
            { new: true, upsert: true }
          );
          res.status(200).json({ user: updateUser });
        }
    } catch (error) {
      next(error);
    }
  }

  static async changePassword(req, res, next) {
    try {
      const userId = req.userId;
      const { password, confirmPassword } = req.body;
      if (!(password == confirmPassword)) {
        throw { name: "BadRequestError", message: "Password does not match!" };
      }
      await userModel.findOneAndUpdate(
        { _id: userId },
        { password: passwordEncryption(password) },
        { new: true, upsert: true }
      );
      res.status(200).json({ message: "Password changed successfully!" });
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(req, res, next) {
    try {
      const { userId } = req.params;
      if (!(await userModel.findOne({ _id: userId }))) {
        throw { name: "BadRequestError", message: "User not found!" };
      }
      await userModel.findOneAndDelete({
        _id: userId,
      });
      res.status(200).json({ message: "User deleted successfully!" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
