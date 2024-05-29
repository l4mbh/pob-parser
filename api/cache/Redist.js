const redis = require('redis');

const REDIS_CONFIG = {
  url: process.env.REDIS_URL,
  socket: {
    tls: true,
  },
};

const client = redis.createClient(REDIS_CONFIG);

client.on('error', (err) => console.error('Redis error:', err));

client.connect().catch(console.error);

module.exports = client;