const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 3600 }); // cache standard Time-To-Live of 1 hour
module.exports = cache;
