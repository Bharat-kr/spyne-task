const express = require('express');
const multer = require('multer');
const router = express.Router();
const discussionController = require('../../controllers/v1/discussion/index');
const middlewares = require('../../middlewares');
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  '/create',
  middlewares.authToken,
  upload.single('image'),
  discussionController.createDiscussion
);
router.post(
  '/update',
  middlewares.authToken,
  discussionController.updateDiscussion
);
router.post(
  '/delete',
  middlewares.authToken,
  discussionController.deleteDiscussion
);

module.exports = router;
