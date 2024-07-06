const express = require('express');
const multer = require('multer');
const router = express.Router();
const discussionController = require('../../controllers/v1/discussion.controller');
const middlewares = require('../../middlewares');
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  '/create',
  middlewares.authToken,
  upload.single('image'),
  discussionController.createDiscussion
);
router.post(
  '/update/:discussion_id',
  middlewares.authToken,
  discussionController.updateDiscussion
);
router.post(
  '/delete/:discussion_id',
  middlewares.authToken,
  discussionController.deleteDiscussion
);

module.exports = router;
