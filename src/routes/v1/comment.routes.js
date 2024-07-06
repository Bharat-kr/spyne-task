const express = require('express');
const commentController = require('../../controllers/v1/comment.controller');
const middlewares = require('../../middlewares');

const router = express.Router();

router.get('/', middlewares.authToken, commentController.getComments);
router.post('/', middlewares.authToken, commentController.postComment);
router.patch('/:id', middlewares.authToken, commentController.updateComment);
router.delete('/:id', middlewares.authToken, commentController.deleteComment);
router.patch('/:id/like', middlewares.authToken, commentController.likeComment);

module.exports = router;
