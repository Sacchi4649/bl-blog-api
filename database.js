const mongoose = require("mongoose");

const connectDb = () => {
  mongoose.connect(process.env.DATABASE);
  console.log("Database connected");
};

module.exports = connectDb;
