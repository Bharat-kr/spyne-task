const express = require('express');
const userRoutes = require('./user.routes');
const authRoutes = require('./auth.routes');
const discussionRoutes = require('./discussion.routes');

const router = express.Router();

router.use('/user', userRoutes);
router.use('/auth', authRoutes);
router.use('/discussion', discussionRoutes);

module.exports = router;
