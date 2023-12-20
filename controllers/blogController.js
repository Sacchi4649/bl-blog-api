"use strict";

const blogModel = require("../models/blogSchema");
// const userModel = require("../models/userSchema");

class BlogController {
  static async createPost(req, res, next) {
    try {
      const { title, content } = req.body;
      const author = req.username;
      const blogPost = new blogModel({
        title,
        content,
        author,
      });
      await blogPost.save();
      res.status(200).json({ blogPost });
    } catch (error) {
      next(error);
    }
  }

  static async getBlogs(_, res, next) {
    try {
      const findBlog = await blogModel.find();
      res.status(200).json({ blog: findBlog });
    } catch (error) {
      next(error);
    }
  }

  static async updateBlog(req, res, next) {
    try {
      const { blogId } = req.params;
      const { title, content } = req.body;

      const findBlog = await blogModel.findOne({ _id: blogId });

      if (!findBlog) {
        throw { name: "BadRequestError", message: "Blog not found!" };
      }

      if (findBlog._id == blogId) {
        const updateBlog = await blogModel.findOneAndUpdate(
          {
            _id: blogId,
          },
          { title, content },
          { new: true, upsert: true }
        );
        res.status(200).json({ blog: updateBlog });
      }
    } catch (error) {
      next(error);
    }
  }

  static async deleteBlog(req, res, next) {
    try {
      const { blogId } = req.params;

      const findBlog = await blogModel.findOne({ _id: blogId });

      if (!findBlog) {
        throw { name: "BadRequestError", message: "Blog not found!" };
      }

      if (findBlog._id == blogId) {
        await blogModel.findOneAndDelete({ _id: blogId });
        res.status(200).json({ message: "Blog deleted successfully!" });
      }
    } catch (error) {
      next(error);
    }
  }

  static async addComment(req, res, next) {
    try {
      const { blogId } = req.params;
      const { comments } = req.body;
      const name = req.username;

      const findBlog = await blogModel.findOne({ _id: blogId });
      comments[0].name = name;
      findBlog.comments.push(comments[0]);

      const updatedComments = findBlog.comments;
      const updateComment = await blogModel.findOneAndUpdate(
        {
          _id: blogId,
        },
        { comments: updatedComments },
        { new: true, upsert: true }
      );
      res.status(200).json({ comments: updateComment });
    } catch (error) {
      next(error);
    }
  }

  static async updateComment(req, res, next) {
    try {
      const { blogId, commentId } = req.params;
      const { comments } = req.body;
      const name = req.username;

      const findBlog = await blogModel.findOne({ _id: blogId });
      comments[0].name = name;

      let commentExist = false;
      findBlog.comments.map(function (comment, index) {
        if (comment._id == commentId) {
          if (findBlog.comments[index].name != name) {
            throw {
              name: "ForbiddenError",
              message: "Can't edit others' comment ",
            };
          }
          findBlog.comments.set(index, comments[0]);
          commentExist = true;
        }
      });
      if (commentExist == false) {
        throw { name: "BadRequestError", message: "Comment not found!" };
      }

      const updatedComments = findBlog.comments;
      const updateComment = await blogModel.findOneAndUpdate(
        {
          _id: blogId,
        },
        { comments: updatedComments },
        { new: true, upsert: true }
      );
      res.status(200).json({ comments: updateComment });
    } catch (error) {
      next(error);
    }
  }

  static async deleteComment(req, res, next) {
    try {
      const { blogId } = req.params;
      const { commentId } = req.body;
      const name = req.username;

      const findBlog = await blogModel.findOne({ _id: blogId });
      if (!findBlog) {
        throw { name: "BadRequestError", message: "Blog does not exist!" };
      }

      findBlog.comments.map(function (_, index) {
        if (findBlog.comments[index].name != name) {
          throw {
            name: "ForbiddenError",
            message: "Can't delete others' comment ",
          };
        }
      });

      findBlog.comments.map(async function (comment, index) {
        if (comment._id == commentId) {
          findBlog.comments.splice(index, 1);
          const updateComment = findBlog.comments;
          res.status(200).json({ message: "Comment deleted successfully!" });
          await blogModel.findOneAndUpdate(
            { _id: blogId },
            { comments: updateComment },
            { new: true, upsert: true }
          );
        }
      });
      return res.status(400).json({ message: "Comment not found!" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = BlogController;
