//var mongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = mongoClient = require('mongodb');
//var assert = require('assert');

var obj = new ObjectID();
console.log(obj);

// Connection URL
var url = 'mongodb://localhost:27017/TodoApp';
// Use connect method to connect to the Server
mongoClient.connect(url, (err, db) => {
  if (err) {
    return console.error("Unable to connect ot MongoDB server");
  }
  console.log("Connected correctly to server");

  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: false
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Unable to insert todo', err);
  //   }

  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // })

  // Insert new doc into Users (name, age, location)
  // db.collection('Users').insertOne({
  //   name: 'Alan Hill',
  //   age: 51,
  //   location: 'Vancouver'
  // }, (err, result) => {
  //   if (err) {
  //     return console.error('Unable to insert user', err);
  //   }

  //   console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
  // })

  db.close();
});
