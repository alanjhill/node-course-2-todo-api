require('./config/config');

const _ = require('lodash');

const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');

var app = express();
// Get the port from the environment variable
const port = process.env.PORT || 3000;

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
    return response.status(404).send();
  } else {
    Todo.findById(id).then((todo) => {
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

app.delete('/todos/:id', (request, response) => {
  // get the id
  var id = request.params.id;

  // validate the id - > not valid, return 404
  if (!ObjectID.isValid(id)) {
    return response.status(404).send();
  } else {
    // remove todo by id
    Todo.findByIdAndRemove(id).then((todo) => {
      // success
      if (!todo) {
        // if no doc, send 404
        return response.status(404).send();
      } else {
        // if doc, send back with 200
        return response.status(200).send({
          todo
        })
      }
    }).catch((e) => {
      // error
      // 400 with empty body
      response.status(400).send();
    });
  }
});

app.patch('/todos/:id', (request, response) => {
  // get the id
  var id = request.params.id;
  var body = _.pick(request.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return response.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id,{ $set: body }, { new: true }).then((todo) => {
    if (!todo) {
      response.status(404).send();
    }

    response.send({ todo });
  }).catch((error) => {
    response.status(400).send()
  });
});

// POST /users
app.post('/users', (request, response) => {
  var body = _.pick(request.body, ['email', 'password']);
  var user = new User(body);

  // User.findByToken
  // user.generateAuthToken

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    response.
    header('x-auth', token).
    send(user);
  }).catch((error) => {
    response.status(400).send(error);
  });
});

// Listen
app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {
  app
};