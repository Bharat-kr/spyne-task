const ImageKit = require('imagekit');
const {
  IMAGEKIT_API_PUBLIC_KEY,
  IMAGEKIT_API_PRIVATE_KEY,
} = require('../utils/config');

const imagekit = new ImageKit({
  publicKey: IMAGEKIT_API_PUBLIC_KEY,
  privateKey: IMAGEKIT_API_PRIVATE_KEY,
  urlEndpoint: 'https://ik.imagekit.io/d0gepge2x',
});

module.exports = imagekit;
