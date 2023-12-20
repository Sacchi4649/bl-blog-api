"use strict";

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: {
      type: String,
      required: true,
      unique: [true, "Email is already registered!"],
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: "{VALUE} is not valid!",
      },
    },
    password: { type: String, required: true },
    role: { type: String, enum: ["author", "reader", "admin"], required: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
