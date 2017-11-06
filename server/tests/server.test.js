const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');
const { User } = require('./../models/user');
const { todos, populateTodos, users, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({ text })
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((response) => {
        expect(response.body.text).toBe(text);
      })
      .end((error, response) => {
        if (error) {
          return done(error);
        }

        Todo.find({ text }).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => {
          done(e);
        });
      });
  });

  it('should not create a new todo with invalid body data', (done) => {

    request(app)
      .post('/todos')
      .send({})
      .set('x-auth', users[0].tokens[0].token)
      .expect(400)
      .end((error, response) => {
        if (error) {
          return done(error);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((error) => {
          done(error);
        });
      });
  });
});

describe('GET  /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((response) => {
        expect(response.body.todos.length).toBe(1);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should get valid todo by id', (done) => {
    request(app)
      .get('/todos/' + todos[0]._id.toHexString())
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((response) => {
        expect(response.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should not return a todo created by other user', (done) => {
    request(app)
      .get('/todos/' + todos[1]._id.toHexString())
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 if non-existent id', (done) => {
    request(app)
      .get('/todos/' + new ObjectID().toHexString())
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 with invalid id', (done) => {
    request(app)
      .get('/todos/' + 'abcdef')
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should delete a  todo', (done) => {
    var hexId = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(200)
      .expect((response) => {
        expect(response.body.todo._id).toBe(hexId);
      })
      .end((error, response) => {
        if (error) {
          return done(error);
        }

        Todo.findById(hexId).then((todo) => {
          expect(todo).toBeFalsy();
          done();
        }).catch((e) => done());
      });
  });

  it('should not delete a todo', (done) => {
    var hexId = todos[0]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end((error, response) => {
        if (error) {
          return done(error);
        }

        Todo.findById(hexId).then((todo) => {
          expect(todo).toBeTruthy();
          done();
        }).catch((e) => done());
      });
  });

  it('should return 404 if todo not found', (done) => {
    var hexId = '59fb66fb22c7f09c7ae52889';
    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end((error, response) => {
        if (error) {
          return done(error);
        }
        done();
      })
  });

  it('should return 404 if object id is invalid', (done) => {
    var hexId = '59fb66fb22c7f09c7ae5288X';
    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end((error, response) => {
        if (error) {
          return done(error);
        }
        done();
      })
  });
});

describe('PATCH /todos/:id', () => {
  it('should update the todo', (done) => {
    var hexId = todos[0]._id.toHexString();
    var text = 'This should be the new text';
    request(app)
      .patch(`/todos/${hexId}`)
      .send({
        completed: true,
        text
      })
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(typeof res.body.todo.completedAt).toBe('number');
      })
      .end(done);
  });

  it('should not update todo created by other user', (done) => {
    var hexId = todos[0]._id.toHexString();
    var text = 'This should be the new text';
    request(app)
      .patch(`/todos/${hexId}`)
      .send({
        completed: true,
        text
      })
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should clear completedAt when todo is not completed', (done) => {
    var hexId = todos[1]._id.toHexString();
    var text = 'This should be the new text!!';

    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({
        completed: false,
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBeFalsy();
      })
      .end(done);
  });
});

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((response) => {
        expect(response.body._id).toBe(users[0]._id.toHexString());
        expect(response.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return a 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((response) => {
        expect(response.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST /users', () => {
  it('should create a user', (done) => {
    var email = 'alanjhill@hotmail.com';
    var password = 'password1';

    request(app)
      .post('/users')
      .send({ email, password })
      .expect(200)
      .expect((response) => {
        expect(response.headers['x-auth']).toBeTruthy();
        expect(response.body._id).toBeTruthy();
        expect(response.body.email).toBe(email);
      })
      .end((error) => {
        if (error) {
          return done(error);
        }

        User.findOne({ email }).then((user) => {
          expect(user).toBeTruthy();
          expect(user.password).not.toBe(password);
          done();
        }).catch((error) => {
          done(error);
        })
      });
  });

  it('should return validation errors if request invalid', (done) => {
    var email = 'invalidemail';
    var password = 'pas';

    request(app)
      .post('users')
      .send({ email, password })
      .expect(401)
    done();

  });

  it('should not create user if email in use', (done) => {
    var email = 'alanjhill@hotmail.com';
    var password = 'password';

    request(app)
      .post('/users')
      .send({ email, password })
      .expect(400);
    done();
  });
})

describe('POST /users/login', () => {
  it('should login user and return auth token', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect((response) => {
        expect(response.headers['x-auth']).toBeTruthy();
      })
      .end((error, response) => {
        if (error) {
          return done(error);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.toObject().tokens[1]).toMatchObject({
            access: 'auth',
            token: response.headers['x-auth']
          });
          done();
        }).catch((error) => {
          done(error);
        });
      });
  });

  it('should reject invalid login', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password + 'blah'
      })
      .expect(400)
      .expect((response) => {
        expect(response.headers['x-auth']).toBeFalsy();
      })
      .end((error, response) => {
        if (error) {
          return done(error);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens.length).toBe(1);
          done();
        }).catch((error) => {
          done(error);
        });
      });
  });
});

describe('DELETE /users/me/token', () => {
  it('should remove auth token on logout', (done) => {
    // DELETE /users/me/token
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((error, response) => {
        if (error) {
          return done(error)
        }
         
        User.findById(users[0]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((error) => {
          done(error);
        })
      });
    });
  });
