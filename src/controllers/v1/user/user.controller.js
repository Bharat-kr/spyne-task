const Repository = require('../../../repository');
const logger = require('../../../utils/logger');
const { DB_TABLES } = require('../../../utils/modelEnums');
const {
  successResponse,
  serverErrorResponse,
  unprocessableEntityResponse,
} = require('../../../utils/response');

const getUser = async (req, res) => {
  try {
    const { id: user_id } = req.user;

    const [user, userErr] = await Repository.fetchOne({
      tableName: DB_TABLES.USER,
      query: {
        id: user_id,
      },
    });
    if (userErr) return serverErrorResponse(res, userErr);
    delete user.password;
    delete user.created_at;
    delete user.updated_at;

    return successResponse(res, 'User fetched Successfuly', user);
  } catch (err) {
    logger.error(`Error in creating user ${err.message}`);
    return serverErrorResponse(res, err.message);
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, phone_number, email } = req.body;
    const { id: user_id } = req.user;

    if (!name || !phone_number || !email)
      return unprocessableEntityResponse(res, 'Please send proper values');

    const [user, userErr] = await Repository.update({
      tableName: DB_TABLES.USER,
      updateObject: {
        name,
        phone_number,
        email,
      },
      where: {
        id: user_id,
      },
    });

    if (userErr) return serverErrorResponse(res, userErr);

    return successResponse(res, 'Successfully updated user', user);
  } catch (err) {
    logger.error(`Error in updating user ${err.message}`);
    return serverErrorResponse(res, err.message);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id: user_id } = req.user;

    const [user, userErr] = await Repository.destroy({
      tableName: DB_TABLES.USER,
      where: {
        id: user_id,
      },
    });

    if (userErr) return serverErrorResponse(res, userErr);

    return successResponse(res, 'Successfully deleted user', user);
  } catch (err) {
    logger.error(`Error in deleting user ${err.message}`);
    return serverErrorResponse(res, err.message);
  }
};

const searchUser = async (req, res) => {
  try {
    const { name, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const [users, usersErr] = await Repository.fetchAll({
      tableName: DB_TABLES.USER,
      query: {
        name: {
          [Op.like]: `%${name}%`,
        },
      },
      extras: {
        offset,
        limit,
        order: [['id', 'ASC']],
      },
    });

    if (usersErr) return serverErrorResponse(res, usersErr);

    return successResponse(res, 'Successfully fetched users', users);
  } catch (err) {
    logger.error(`Error in fetching users ${err.message}`);
    return serverErrorResponse(res, err.message);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const offset = (page - 1) * limit;
    const [users, usersErr] = await Repository.fetchAll({
      tableName: DB_TABLES.USER,
      extras: {
        offset,
        limit,
        // order: [['id', 'ASC']],
      },
    });
    if (usersErr) return serverErrorResponse(res, usersErr);
    return successResponse(res, 'Successfully fetched users', users);
  } catch (err) {
    logger.error(`Error in fetching users ${err.message}`);
    return serverErrorResponse(res, err.message);
  }
};

const followUser = async (req, res) => {
  try {
    const { user_id } = req.body;
    const { id: follower_id, status } = req.user;
    if (status) {
      const [follower, followerErr] = await Repository.create({
        tableName: DB_TABLES.FOLLOWER,
        createObject: {
          user_id,
          follower_id,
        },
      });
    } else {
      await Repository.destroy({
        tableName: DB_TABLES.FOLLOWER,
        where: {
          user_id,
          follower_id,
        },
      });
    }
    await Repository.update({
      tableName: DB_TABLES.USER,
      updateObject: {
        follower_count: Sequelize.literal(
          `follower_count ${status ? '+' : '-'} 1`
        ),
      },
      query: {
        id: user_id,
      },
    });
    return successResponse(res, 'Successfully followed user');
  } catch (err) {
    logger.error(`Error in following user ${err.message}`);
    return serverErrorResponse(res, err.message);
  }
};

module.exports = {
  getUser,
  updateUser,
  deleteUser,
  searchUser,
  getAllUsers,
  followUser,
};
