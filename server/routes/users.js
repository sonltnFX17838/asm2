const express = require("express");

const router = express.Router();

const userController = require("../controllers/users");
const isAuth = require("../middlewares/is-auth");

router.post("/sign-up", userController.postCreateUser);

router.post("/login", userController.postLoginUser);

router.post("/logout", userController.postLogoutUser);

router.get("/isloggedin", isAuth.isAuth, userController.isLoggedIn);

module.exports = router;
