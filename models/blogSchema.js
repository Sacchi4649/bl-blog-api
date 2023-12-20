const mongoose = require("mongoose");
const comments = new mongoose.Schema({
  name: String,
  text: String,
});
const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    content: { type: String, required: true },
    comments: [comments],
  },
  { timestamps: true }
);

const BlogPost = mongoose.model("BlogPost", blogSchema);

module.exports = BlogPost;
