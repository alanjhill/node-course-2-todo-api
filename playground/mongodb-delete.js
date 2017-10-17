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

  // deleteMany
  // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
  //   console.log(result);
  // });

  // deleteOne
  // db.collection('Todos').deleteOne({text: 'Drink coffee'}).then((result) => {
  //   console.log(result);
  // });

  // findOneAndDelete
  // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
  //   console.log(result);
  // });


  db.collection('Users').deleteMany({name: 'Alan Hill'}).then((result) => {
    console.log(JSON.stringify(result, undefined, 2));
  });

  // db.collection('Users').findOneAndDelete({
  //   _id: new ObjectID("59e66061b0e1d1021256bd86")})
  //   .then((result) => {
  //     console.log(result);
  //   });

  db.close();
});
