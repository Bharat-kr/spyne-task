const express = require('express');
const userRoutes = require('./user.routes');
const authRoutes = require('./auth.routes');
const discussionRoutes = require('./discussion.routes');
const commentRoutes = require('./comment.routes');

const router = express.Router();

router.use('/user', userRoutes);
router.use('/auth', authRoutes);
router.use('/discussion', discussionRoutes);
router.use('/comment', commentRoutes);

module.exports = router;
