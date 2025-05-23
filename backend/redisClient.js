const Redis = require('ioredis');
const redis = new Redis(); // Defaults to localhost:6379
module.exports = redis;