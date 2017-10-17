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

  // db.collection('Todos').findOneAndUpdate(
  //   {
  //     _id: new ObjectID("59e65f5eb0e1d1021256bd28")
  //   },
  //   {
  //     $set: {completed: true}
  //   },
  //   {returnOriginal: false}
  // ).then((result, err) => {
  //   console.log(result, err);
  // });

  db.collection('Users').findOneAndUpdate(
    {
      name: 'Alan'
    },
    {
      $set: {name: 'Alan Hill'},
      $inc: {age: 1}
    },
    {returnOriginal: false}
  ).then((result) => {
    console.log(result, err);
  });

  db.close();
});
