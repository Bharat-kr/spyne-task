const {
  Comment,
  Discussion,
  Follower,
  Hashtag,
  Hashtag_Discussion,
  User,
} = require('../db/models');

const DB_TABLES = {
  COMMENT: 'comment',
  DISCUSSION: 'discussion',
  FOLLOWER: 'follower',
  HASHTAG: 'hashtag',
  HASHTAG_DISCUSSION: 'hashtag_discussion',
  USER: 'user',
};

const DB_MODELS = {
  comment: Comment,
  discussion: Discussion,
  follower: Follower,
  hashtag: Hashtag,
  hashtag_discussion: Hashtag_Discussion,
  user: User,
};

module.exports = { DB_TABLES, DB_MODELS };
