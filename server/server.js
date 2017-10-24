var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (request, response) => {
  var todo = new Todo({
    text: request.body.text
  });
  todo.save().then((doc) => {
    response.send(doc);
  }, (e) => {
    response.status(400).send(e);
  });
});

app.get('/todos', (request, response) => {
  Todo.find().then((todos) => {
    response.send({
      todos
    })
  }, (e) => {
    response.status(400).send(e);
  });
});

app.get('/todos/:id', (request, response) => {
  var id = request.params.id;

  if (ObjectID.isValid(id)) {

  } else {
    console.error("Invalid ID", id);
    response.send(404);
  }
});


// Listen
app.listen(3000, () => {
  console.log('Started on port 3000');
});

module.exports = {
  app
};