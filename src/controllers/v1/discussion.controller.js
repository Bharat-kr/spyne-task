const Repository = require('../../repository');
const imagekit = require('../../services/imagekit.service');
const logger = require('../../utils/logger');
const { DB_TABLES } = require('../../utils/modelEnums');
const {
  serverErrorResponse,
  unprocessableEntityResponse,
  unauthorizedResponse,
  successResponse,
  createdSuccessResponse,
} = require('../../utils/response');

const createDiscussion = async (req, res) => {
  try {
    const { id: user_id } = req.user;
    let { text, hashtags } = req.body;
    hashtags = hashtags.split(',');
    if (!text)
      return unprocessableEntityResponse(res, 'Please send proper values');

    const result = await imagekit.upload({
      file: req.file.buffer,
      fileName: `U${user_id}_T${Date.now()}.${req.file.originalname.split('.').pop()}`,
      useUniqueFileName: false,
      folder: '/uploads/',
    });
    const { url, fileId } = result;

    const [discussion, discussionErr] = await Repository.create({
      tableName: DB_TABLES.DISCUSSION,
      createObject: {
        user_id,
        text,
        image: url,
        imagekit_file_id: fileId,
      },
    });

    if (discussionErr) return serverErrorResponse(res, discussionErr);

    const [discussionHashtags, discussionHashtagsErr] =
      await Repository.bulkCreate({
        tableName: DB_TABLES.HASHTAG,
        createObject: hashtags.map((hashtag) => ({ name: hashtag })),
        extras: {
          fields: ['name'],
          updateOnDuplicate: ['name'],
        },
      });

    if (discussionHashtagsErr)
      return serverErrorResponse(res, discussionHashtagsErr);

    const [hashtagDiscussion, hashtagDiscussionErr] =
      await Repository.bulkCreate({
        tableName: DB_TABLES.HASHTAG_DISCUSSION,
        createObject: discussionHashtags.map((hashtag) => ({
          discussion_id: discussion.id,
          hashtag_id: hashtag.id,
        })),
        extras: {
          fields: ['discussion_id', 'hashtag_id'],
        },
      });

    if (hashtagDiscussionErr)
      return serverErrorResponse(res, hashtagDiscussionErr);

    return createdSuccessResponse(res, 'Discussion created successfully', {
      ...discussion,
      hashtags: discussionHashtags,
    });
  } catch (err) {
    logger.error(`Error in create Discussion ${err.message}`);
    return serverErrorResponse(res, err.message);
  }
};

const updateDiscussion = async (req, res) => {
  try {
  } catch (err) {
    logger.error(`Error in updating discussion ${err.message}`);
    return serverErrorResponse(res, err.message);
  }
};

const deleteDiscussion = async (req, res) => {};

const discussionController = {
  createDiscussion,
  updateDiscussion,
  deleteDiscussion,
};

module.exports = discussionController;
