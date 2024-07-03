const express = require('express');
const { authController } = require('../../controllers/v1/user');

const router = express.Router();

// CREATE
router.post('/login', authController.login);
router.post('/signup', authController.signup);

module.exports = router;
