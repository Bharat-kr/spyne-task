module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS),
  JWT_SECRET: process.env.JWT_SECRET,
  DEV_SECRET: process.env.DEV_SECRET,
  BACKEND_SERVICE_PORT: process.env.BACKEND_SERVICE_PORT,
  DEPLOYED_BACKEND_HOST: process.env.DEPLOYED_BACKEND_HOST,
};
