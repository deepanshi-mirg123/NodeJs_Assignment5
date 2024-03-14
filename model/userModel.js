const mongoose = require("mongoose");
const validator = require("validator");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is Required Field"],
  },
  email: {
    type: String,
    required: [true, "Please enter an email."],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid email."],
  },
  address: {
    type: String,
    required: [true, "Address is Required Field"],
  },
  occupation: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "Please enter a Password."],
    minlength: 8,
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.appsecret);
  return token;
};
const User = mongoose.model("User", userSchema);

const validate = (User) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    address: Joi.string().required(),
    occupation: Joi.string(),
    password: Joi.string().min(8).required(),
  });
  return schema.validate(User);
};

const Loginvalidate = (User) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  return schema.validate(User);
};
module.exports = { User, validate, Loginvalidate };
