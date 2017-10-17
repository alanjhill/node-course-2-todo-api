//var mongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = mongoClient = require('mongodb');
//var assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/TodoApp';
// Use connect method to connect to the Server
mongoClient.connect(url, (err, db) => {
  if (err) {
    return console.error("Unable to connect ot MongoDB server");
  }
  console.log("Connected correctly to server");

  db.collection('Todos').find({_id: new ObjectID('59e4da2a232ab042851be06e')}).toArray().then((docs) => {
    console.log('Todos');
    console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
    console.log('Unable to fetch Todos', err);
  });

  db.collection('Todos').count().then((count) => {
    console.log(`Todos count: ${count}`);
    }, (err) => {
    console.log('Unable to fetch Todos', err);
  });

  db.close();
});
