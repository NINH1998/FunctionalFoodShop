require('./Worker');
const Queue = require('bull');

const { REDIS_URI, REDIS_PORT, REDIS_PASSWORD } = require('../Config/Redis');

const redisConfig = {
    redis: {
        host: REDIS_URI,
        port: REDIS_PORT,
        password: REDIS_PASSWORD,
    },
};
const orderQueue = new Queue('orderQueue', redisConfig);
const likeQueue = new Queue('likeQueue', redisConfig);
const likeReplyQueue = new Queue('likeReplyQueue', redisConfig);
const dislikeReplyQueue = new Queue('dislikeReplyQueue', redisConfig);
const dislikeQueue = new Queue('dislikeQueue', redisConfig);

module.exports = { likeQueue, dislikeQueue, orderQueue, likeReplyQueue, dislikeReplyQueue };
