const jwtHelper = require('../../../helpers/jwt');
const Repository = require('../../../repository');
const logger = require('../../../utils/logger');
const { DB_TABLES } = require('../../../utils/modelEnums');
const {
  serverErrorResponse,
  unprocessableEntityResponse,
  unauthorizedResponse,
  successResponse,
  createdSuccessResponse,
} = require('../../../utils/response');

const createDiscussion = async (req, res) => {
  try {
    const { id: user_id } = req.user;
    const { text, image, hashtags } = req.body;
    if (!text)
      return unprocessableEntityResponse(res, 'Please send proper values');

    //upload image to a host and save its link in image
    const [discussion, discussionErr] = await Repository.create({
      tableName: DB_TABLES.DISCUSSION,
      insertObject: {
        user_id,
        text,
        image,
      },
    });

    const [discussionHashtags, discussionHashtagsErr] =
      await Repository.bulkCreate({
        tableName: DB_TABLES.HASHTAG,
        createObject: hashtags,
        extras: {
          fields: ['name'],
          updateOnDuplicate: ['name'],
        },
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
