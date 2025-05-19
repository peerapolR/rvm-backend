const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/user");
const config = require("../config/index");
const responseMessage = require("../utils/responseMessage");
const axios = require("axios");

exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, tel, role } = req.body;

    //validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("format invalid");
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }
    // const existUser = await User.findOne({ username });
    // if (existUser) {
    //   const error = new Error("Username already use!!");
    //   error.statusCode = 400;
    //   throw error;
    // }
    // const existId = await User.findOne({ id });
    // if (existId) {
    //   const error = new Error("ID already use!!");
    //   error.statusCode = 400;
    //   throw error;
    // }

    const count = await User.countDocuments();
    const empId = `RVM${count.toString().padStart(4, "0")}`;

    const empUsername = `${lastName.substring(0, 1)}${firstName.toLowerCase()}`;
    const password = "123456";

    let user = new User();
    user.id = empId;
    user.username = empUsername;
    user.password = await user.encryPassword(password);
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.tel = tel;
    user.role = role;
    await user.save();
    return res
      .status(201)
      .json({ ...responseMessage.success, data: "Registed" });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    //check email exist system
    const user = await User.findOne({
      username: username.toLowerCase(),
    }).select("-createdAt -updatedAt -__v");
    if (!user) {
      const error = new Error("Username Not Found");
      error.statusCode = 404;
      throw error;
    }
    // compare password ถ้าไม่ตรง Return false
    const isValid = await user.checkPassword(password);
    if (!isValid) {
      const error = new Error("Password Invalid");
      error.statusCode = 401;
      throw error;
    }

    //create token
    const token = await jwt.sign(
      {
        id: user._id,
      },
      config.JWT_SECRET,
      { expiresIn: "1 day" }
    );

    //decode expiresIn
    const expires_in = jwt.decode(token);

    return res.status(200).json({
      ...responseMessage.success,
      data: user,
      message: "login success",
      access_token: token,
      expires_in: expires_in.exp,
      token_type: "Bearer",
    });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { _id } = req.params;
    const { firstName, lastName, tel, email, role } = req.body;

    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   const error = new Error("format invalid");
    //   error.statusCode = 422;
    //   error.validation = errors.array();
    //   throw error;
    // }

    const existUser = await User.findOne({ _id: _id });
    if (!existUser) {
      const error = new Error("Username does not exist!!");
      error.statusCode = 401;
      throw error;
    }
    // if (existUser.password === password) {
    //   const error = new Error("New password are same with old password!!");
    //   error.statusCode = 401;
    //   throw error;
    // }

    const editUser = await User.updateOne(
      { _id: _id },
      {
        // password: await existUser.encryPassword(password),
        firstName,
        lastName,
        tel,
        email,
        role,
      }
    );
    if (editUser.nModified === 0) {
      throw new Error("ไม่สามารถแก้ไขข้อมูลได้");
    } else {
      res.status(200).json({
        ...responseMessage.success,
        data: "updated",
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.me = async (req, res, next) => {
  try {
    return res.status(200).json({
      ...responseMessage.success,
      data: req.user,
    });
  } catch (error) {
    next(error);
  }
};

// Tong created since this

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find() //get all users
      .select("-username -password -__v")
      .sort({ id: 1 });

    return res.status(200).json({
      ...responseMessage.success,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const { _id } = req.params;

    const user = await User.findOne({ _id: _id })
      .select("firstName lastName tel email role")
      .exec();

    if (!user) {
      const error = new Error("User is not found");
      error.statusCode = 404;
      throw error;
    }

    return res.status(200).json({
      ...responseMessage.success,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { _id } = req.params;
    const defaultPassword = "123456";
    const user = await User.findOne({ _id: _id });

    if (!user) {
      const error = new Error("User is not found");
      error.statusCode = 404;
      throw error;
    }

    user.password = await user.encryPassword(defaultPassword);
    await user.save();

    const isPasswordValid = await user.checkPassword(defaultPassword);
    if (!isPasswordValid) {
      const error = new Error(
        "Password reset failed - hash verification error"
      );
      error.statusCode = 500;
      throw error;
    }

    return res.status(200).json({
      ...responseMessage.success,
      message: "Password has been reset to 123456",
    });
  } catch (error) {
    next(error);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const { _id } = req.params;
    const { current_password, new_password, confirm_password } = req.body;

    const user = await User.findOne({ _id: _id });
    if (!user) {
      const error = new Error("User is not found");
      error.statusCode = 404;
      throw error;
    }

    const isValid = await user.checkPassword(current_password);
    if (!isValid) {
      const error = new Error("Password Invalid");
      error.statusCode = 401;
      throw error;
    }

    if (new_password !== confirm_password) {
      const error = new Error("New password and confirm password do not match");
      error.statusCode = 400;
      throw error;
    }

    if (!new_password || new_password.length < 5) {
      const error = new Error("Password must be at least 5 characters");
      error.statusCode = 422;
      throw error;
    }

    user.password = await user.encryPassword(new_password);
    await user.save();

    const isPasswordValid = await user.checkPassword(new_password);
    if (!isPasswordValid) {
      const error = new Error(
        "Password update failed - hash verification error"
      );
      error.statusCode = 500;
      throw error;
    }

    return res.status(200).json({
      ...responseMessage.success,
      message: "Password is updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteUserById = async (req, res, next) => {
  try {
    const { _id } = req.params;
    const user = await User.findOne({ _id: _id });

    if (!user) {
      const error = new Error("User is not found");
      error.statusCode = 404;
      throw error;
    }

    await User.deleteOne({ _id: id });

    return res.status(200).json({
      ...responseMessage.success,
      message: "User is deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
