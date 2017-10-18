const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// URL for mongodb
var url = 'mongodb://localhost:27017/TodoApp';

// Connect
mongoose.connect(url, {useMongoClient: true});

module.exports = {
  mongoose
};