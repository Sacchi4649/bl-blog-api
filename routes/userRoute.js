"use strict";

const router = require("express").Router();
const UserController = require("../controllers/userController");
const authentication = require("../middlewares/authentication");

router.post("/", UserController.createUser);
router.post("/login", UserController.login);
router.get("/", authentication, UserController.getAllUser);
router.put("/:userId", authentication, UserController.editUser);
router.patch("/password", authentication, UserController.changePassword);
router.delete("/:userId", authentication, UserController.deleteUser);

module.exports = router;
