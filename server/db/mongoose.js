const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// URL for mongodb.  Use env var if it exists, else localhost
var url = process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp';

// Connect
mongoose.connect(url, {useMongoClient: true});

module.exports = {
  mongoose
};