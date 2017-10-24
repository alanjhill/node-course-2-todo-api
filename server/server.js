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

  if (!ObjectID.isValid(id)) {
    console.error("Invalid ID", id);
    return response.status(404).send();
  } else {
    Todo.findById(id).then((todo) => {
      console.log("todo", todo);
      if (!todo) {
        return response.status(404).send();
      } else {
        response
        .send({
          todo
        });
      }
    }).catch((e) => {
      response.status(400).send();
    });
  }
});


// Listen
app.listen(3000, () => {
  console.log('Started on port 3000');
});

module.exports = {
  app
};