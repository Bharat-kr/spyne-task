const { create } = require('axios');
const { IMAGEKIT_API_KEY } = require('../utils/config');

const imagekit = create({
  baseURL: 'https://upload.imagekit.io/api',
  headers: {
    Authorization: `Basic ${IMAGEKIT_API_KEY}`,
    'Content-Type': 'multipart/form-data',
    Accept: 'application/json',
  },
});

module.exports = imagekit;
