const Repository = require('../../repository');
const imagekit = require('../../services/imagekit.service');
const logger = require('../../utils/logger');
const { DB_TABLES } = require('../../utils/modelEnums');
const {
  serverErrorResponse,
  unprocessableEntityResponse,
  successResponse,
  createdSuccessResponse,
} = require('../../utils/response');

const getAllDiscussions = async (req, res) => {
  try {
    const { id: user_id } = req.user;
    const [discussions, discussionsErr] = await Repository.fetchAll({
      tableName: DB_TABLES.DISCUSSION,
      query: {
        user_id,
      },
      include: {
        [DB_TABLES.HASHTAG]: {
          attributes: ['name'],
          as: 'hashtags',
        },
      },
    });
    if (discussionsErr) return serverErrorResponse(res, discussionsErr);

    return successResponse(
      res,
      'All discussions fetched successfully',
      discussions
    );
  } catch (err) {
    logger.error(`Error in fetching all discussions ${err.message}`);
    return serverErrorResponse(res, err.message);
  }
};

const getDiscussion = async (req, res) => {
  try {
    const { discussion_id } = req.params;
    const [discussion, discussionErr] = await Repository.fetchOne({
      tableName: DB_TABLES.DISCUSSION,
      query: { id: discussion_id },
      include: {
        [DB_TABLES.HASHTAG]: {
          attributes: ['name'],
          as: 'hashtags',
        },
      },
    });

    if (discussionErr) return serverErrorResponse(res, discussionErr);
    return successResponse(res, 'Discussion fetched successfully', discussion);
  } catch (err) {
    logger.error(`Error in fetching discussion ${err.message}`);
    return serverErrorResponse(res, err.message);
  }
};

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

    const [, hashtagDiscussionErr] = await Repository.bulkCreate({
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
    const { id: user_id } = req.user;
    const { discussion_id } = req.params;
    let { text, hashtags } = req.body;
    if (hashtags) hashtags = hashtags.split(',');
    else hashtags = [];

    const [discussionData, discussionDataErr] = await Repository.fetchOne({
      tableName: DB_TABLES.DISCUSSION,
      query: { id: discussion_id, user_id },
    });

    if (discussionDataErr) return serverErrorResponse(res, discussionDataErr);

    const updateObj = {};

    updateObj.text = text;

    if (req.file) {
      await imagekit.deleteFile(discussionData.imagekit_file_id);
      const result = await imagekit.upload({
        file: req.file.buffer,
        fileName: `U${user_id}_T${Date.now()}.${req.file.originalname.split('.').pop()}`,
        useUniqueFileName: false,
        folder: '/uploads/',
      });
      const { url, fileId } = result;
      updateObj.image = url;
      updateObj.imagekit_file_id = fileId;
    }
    const [, discussionErr] = await Repository.update({
      tableName: DB_TABLES.DISCUSSION,
      query: { id: discussion_id },
      updateObject: updateObj,
    });
    if (discussionErr) return serverErrorResponse(res, discussionErr);

    const [existingHashtags, existingHashtagsErr] = await Repository.fetchAll({
      tableName: DB_TABLES.HASHTAG,
      query: { id: discussion_id },
    });

    if (existingHashtagsErr)
      return serverErrorResponse(res, existingHashtagsErr);

    const removedHashtags = existingHashtags.filter(
      (hashtag) => !hashtags.includes(hashtag.name)
    );

    const [, removedMappingsErr] = await Repository.destroy({
      tableName: DB_TABLES.HASHTAG_DISCUSSION,
      query: removedHashtags.map((hashtag) => ({
        discussion_id: discussion_id,
        hashtag_id: hashtag.id,
      })),
    });

    if (removedMappingsErr) return serverErrorResponse(res, removedMappingsErr);

    const [newHashtagObjects, newHashtagObjectsErr] =
      await Repository.bulkCreate({
        tableName: DB_TABLES.HASHTAG,
        createObject: hashtags.map((hashtag) => ({ name: hashtag })),
        extras: {
          fields: ['name'],
          updateOnDuplicate: ['name'],
        },
      });

    if (newHashtagObjectsErr)
      return serverErrorResponse(res, newHashtagObjectsErr);

    const [, newMappingsErr] = await Repository.bulkCreate({
      tableName: DB_TABLES.HASHTAG_DISCUSSION,
      createObject: newHashtagObjects.map((hashtag) => ({
        discussion_id: discussion_id,
        hashtag_id: hashtag.id,
      })),
    });

    if (newMappingsErr) return serverErrorResponse(res, newMappingsErr);

    return successResponse(res, 'Discussion updated successfully');
  } catch (err) {
    logger.error(`Error in updating discussion ${err.message}`);
    return serverErrorResponse(res, err.message);
  }
};

const deleteDiscussion = async (req, res) => {
  try {
    const { discussion_id } = req.params;
    const [discussionData, discussionDataErr] = await Repository.fetchOne({
      tableName: DB_TABLES.DISCUSSION,
      query: { id: discussion_id },
    });
    if (discussionDataErr) return serverErrorResponse(res, discussionDataErr);
    const [, discussionHashtagsErr] = await Repository.destroy({
      tableName: DB_TABLES.HASHTAG_DISCUSSION,
      query: { discussion_id },
    });

    if (discussionHashtagsErr)
      return serverErrorResponse(res, discussionHashtagsErr);

    const [, discussionErr] = await Repository.destroy({
      tableName: DB_TABLES.DISCUSSION,
      query: { id: discussion_id },
    });

    if (discussionErr) return serverErrorResponse(res, discussionErr);

    await imagekit.deleteFile(discussionData.imagekit_file_id);

    return successResponse(res, 'Discussion deleted successfully');
  } catch (err) {
    logger.error(`Error in deleting discussion ${err.message}`);
    return serverErrorResponse(res, err.message);
  }
};

const discussionController = {
  getAllDiscussions,
  getDiscussion,
  createDiscussion,
  updateDiscussion,
  deleteDiscussion,
};

module.exports = discussionController;
