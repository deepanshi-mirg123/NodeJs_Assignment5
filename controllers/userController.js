const { User, validate, Loginvalidate } = require("../model/userModel");
const mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//API to get details of all the user
exports.getalldata = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({
      status: "success",
      length: users.length,
      data: {
        users,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

//API to get detail of a particular user
exports.getdata = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const pas = user.password;

    return res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

//API to update a user
exports.updatedata = async (req, res) => {
  try {
    const updateduser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        user: updateduser,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

//API to create a new user
exports.postdata = async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const users = await User.findOne({ email: req.body.email });
    if (users) {
      return res.status(400).json({
        status: "failed",
        message: "Email id Already Exist",
      });
    }

    const user = new User(req.body);

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    const check = await User.findOne({ email: req.body.email });

    const token = check.generateAuthToken();

    return res.status(201).json({
      status: "success",
      data: {
        user,
        "x_access_token": token,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

//API to delete a particular user
exports.deletedata = async (req, res) => {
  try {
    const del = await User.findByIdAndDelete(req.params.id);
    if (del) {
      res.status(200).json({
        status: "sucess",
        data: null,
        message: `(${req.params.id}) This Id Deleted Successfully )`,
      });
    } else {
      res.status(400).json({
        status: "Fail",
        message: "Id not Found",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
//API to Login the user
exports.loginUser = async (req, res) => {
  try {
    const { error } = Loginvalidate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const users = await User.findOne({ email: req.body.email });
    if (users) {
      const isPass = await bcrypt.compare(req.body.password, users.password);

      if (isPass) {
        // const token = users.generateAuthToken();
        //
        return res.status(200).json({
          status: "success",
          data: {
            users,
          },
          message: "Login Successfully ",
        });
      } else {
        return res.status(400).json({
          status: "Please Enter the Correct Password",
          data: {},
        });
      }
    } else {
      return res.status(400).json({
        status: "Please Enter the Correct Email Id",
        data: {},
      });
    }
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};
