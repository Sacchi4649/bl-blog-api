"use strict";

const router = require("express").Router();
const BlogController = require("../controllers/blogController");
const authentication = require("../middlewares/authentication");

router.post("/", authentication, BlogController.createPost);
router.get("/", BlogController.getBlogs);
router.put("/:blogId", authentication, BlogController.updateBlog);
router.delete("/:blogId", authentication, BlogController.deleteBlog);

router.put("/comment/:blogId", authentication, BlogController.addComment);
router.put(
  "/comment/:blogId/edit/:commentId",
  authentication,
  BlogController.updateComment
);
router.post("/comment/:blogId", authentication, BlogController.deleteComment);

module.exports = router;
