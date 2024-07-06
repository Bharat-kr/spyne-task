const Repository = require('../../repository');
const logger = require('../../utils/logger');
const { DB_TABLES } = require('../../utils/modelEnums');
const {
  serverErrorResponse,
  successResponse,
  createdSuccessResponse,
} = require('../../utils/response');

const getComments = async (req, res) => {
  try {
    const { discussion_id, comment_id } = req.query;
    if (comment_id) {
      // sending replies of a comment
      const [comment, commentErr] = await Repository.fetchOne({
        tableName: DB_TABLES.COMMENT,
        query: { comment_id, discussion_id },
      });
      if (commentErr) return serverErrorResponse(res, commentErr);
      return successResponse(res, 'Comment fetched successfully', comment);
    } else {
      // sending all comments of a discussion
      const [comments, commentsErr] = await Repository.fetchAll({
        tableName: DB_TABLES.COMMENT,
        query: { discussion_id },
      });
      if (commentsErr) return serverErrorResponse(res, commentsErr);
      return successResponse(res, 'Comments fetched successfully', comments);
    }
  } catch (err) {
    logger.error(`Error in fetching comments ${err.message}`);
    return serverErrorResponse(res, err.message);
  }
};

const postComment = async (req, res) => {
  try {
    const { id: user_id } = req.user;
    const { discussion_id, content, content_id } = req.body;
    const [comment, commentErr] = await Repository.create({
      tableName: DB_TABLES.COMMENT,
      createObject: {
        user_id,
        discussion_id,
        content,
        content_id,
      },
    });
    if (commentErr) return serverErrorResponse(res, commentErr);
    return createdSuccessResponse(res, 'Comment posted successfully', comment);
  } catch (err) {
    logger.error(`Error in posting comment: ${err.message}`);
    return serverErrorResponse(res, err.message);
  }
};

const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: user_id } = req.user;
    const { content } = req.body;
    const [comment, commentErr] = await Repository.update({
      tableName: DB_TABLES.COMMENT,
      query: { id, user_id },
      updateObject: { content },
    });
    if (commentErr) return serverErrorResponse(res, commentErr);
    return successResponse(res, 'Comment updated successfully', comment);
  } catch (err) {
    logger.error(`Error in updating comment: ${err.message}`);
    return serverErrorResponse(res, err.message);
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const [comment, commentErr] = await Repository.destroy({
      tableName: DB_TABLES.COMMENT,
      query: { id },
    });
    // DO recursive delete for all the comments that have this comment as parent
    if (commentErr) return serverErrorResponse(res, commentErr);
    return successResponse(res, 'Comment deleted successfully', comment);
  } catch (err) {
    logger.error(`Error in deleting comment: ${err.message}`);
    return serverErrorResponse(res, err.message);
  }
};

const likeComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { liked } = req.query;
    const [comment, commentErr] = await Repository.fetchOne({
      tableName: DB_TABLES.COMMENT,
      query: { id },
    });
    if (commentErr) return serverErrorResponse(res, commentErr);
    const [like, likeErr] = await Repository.update({
      tableName: DB_TABLES.COMMENT,
      query: { id },
      updateObject: {
        like_count: liked ? comment.like_count + 1 : comment.like_count - 1,
      },
    });
    if (likeErr) return serverErrorResponse(res, likeErr);
    return createdSuccessResponse(res, 'Comment liked successfully');
  } catch (err) {
    logger.error(`Error in liking comment: ${err.message}`);
    return serverErrorResponse(res, err.message);
  }
};

const commentController = {
  getComments,
  postComment,
  updateComment,
  deleteComment,
  likeComment,
};

module.exports = commentController;
