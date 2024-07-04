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

const bcrypt = require('bcrypt');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) unprocessableEntityResponse(res, 'email not found');
    if (!password) unprocessableEntityResponse(res, 'password not found');

    const [user, userErr] = await Repository.fetchOne({
      tableName: DB_TABLES.USER,
      query: { email },
    });
    if (userErr) return serverErrorResponse(res, userErr);

    if (!user) return unauthorizedResponse(res, 'User not found');

    if (!bcrypt.compareSync(password, user.password))
      return unauthorizedResponse(
        res,
        'Password does not match. Kindly retry.'
      );

    // generate token
    const accessToken = jwtHelper.generate({
      id: user.id,
    });

    delete user.password;
    delete user.created_at;
    delete user.updated_at;

    return successResponse(res, 'Login successful', {
      ...user,
      access_token: accessToken,
    });
  } catch (err) {
    logger.error(`Error in login user ${err.message}`);
    return serverErrorResponse(res, err.message);
  }
};

const signup = async (req, res) => {
  try {
    const { name, phone_number, email, password } = req.body;

    if (!name || !phone_number || !email || !password)
      return unprocessableEntityResponse(res, 'Please send proper values');

    const [user, userErr] = await Repository.create({
      tableName: DB_TABLES.USER,
      createObject: {
        name,
        phone_number,
        email,
        password,
      },
    });

    if (userErr) return serverErrorResponse(res, userErr);

    return createdSuccessResponse(res, 'Signup Successfull', {
      name: user.name,
      phone_number: user.phone_number,
      email: user.email,
    });
  } catch (err) {
    logger.error(`Error in creating user ${err.message}`);
    return serverErrorResponse(res, err.message);
  }
};

module.exports = {
  login,
  signup,
};
