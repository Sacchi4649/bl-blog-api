"use strict";

const router = require("express").Router();
const blogRoute = require("./blogRoute");
const userRoute = require("./userRoute");

router.use("/blog", blogRoute);
router.use("/user", userRoute);

module.exports = router;
