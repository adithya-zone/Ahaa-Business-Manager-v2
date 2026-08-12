const express = require("express");

const authController = require("../controllers/authController");

const router = express.Router();

// ==========================================
// Login
// ==========================================

router.post(

    "/login",

    authController.login

);

// ==========================================
// Current User
// ==========================================

router.get(

    "/me",

    authController.getCurrentUser

);

// ==========================================
// Logout
// ==========================================

router.post(

    "/logout",

    authController.logout

);

module.exports = router;