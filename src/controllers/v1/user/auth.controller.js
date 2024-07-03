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
    const { phone_number, password } = req.body;
    if (!phone_number)
      unprocessableEntityResponse(res, 'phone_number not found');
    if (!password) unprocessableEntityResponse(res, 'password not found');

    const [user, userErr] = await Repository.fetchOne({
      tableName: DB_TABLES.USER,
      query: { phone_number },
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
      first_name: user.name,
      phone_number: user.phone_number,
    });

    delete user.password;
    delete user.created_at;
    delete user.updated_at;

    return successResponse(res, 'Login successful', { ...user, accessToken });
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

    return createdSuccessResponse(res, 'Signup Successfull', user);
  } catch (err) {
    logger.error(`Error in creating user ${err.message}`);
    return serverErrorResponse(res, err.message);
  }
};

module.exports = {
  login,
  signup,
};
