const express = require('express');
const multer = require('multer');
const router = express.Router();
const discussionController = require('../../controllers/v1/discussion.controller');
const middlewares = require('../../middlewares');
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', middlewares.authToken, discussionController.getAllDiscussions);
router.get(
  '/:discussion_id',
  middlewares.authToken,
  discussionController.getDiscussion
);
router.post(
  '/',
  middlewares.authToken,
  upload.single('image'),
  discussionController.createDiscussion
);
router.patch(
  '/:discussion_id',
  middlewares.authToken,
  upload.single('image'),
  discussionController.updateDiscussion
);
router.patch(
  '/:discussion_id/like',
  middlewares.authToken,
  discussionController.likeDiscussion
);
router.delete(
  '/:discussion_id',
  middlewares.authToken,
  discussionController.deleteDiscussion
);

module.exports = router;
