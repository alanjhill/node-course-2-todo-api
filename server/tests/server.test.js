const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');

const todos = [
  {
    _id: new ObjectID(),
    text: "First test todo"
  },
  {
    _id: new ObjectID(),
    text: "Second test todo"
  }
];

beforeEach((done) => {
  Todo.remove({}).then(() => {
    Todo.insertMany(todos);
  }).then(() => {
    done();
  });
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({ text })
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
      .expect(200)
      .expect((response) => {
        expect(response.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should get valid todo by id', (done) => {
    request(app)
      .get('/todos/' + todos[0]._id.toHexString())
      .expect(200)
      .expect((response) => {
        expect(response.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should return 404 if non-existent id', (done) => {
    request(app)
      .get('/todos/' + new ObjectID().toHexString())
      .expect(404)
      .end(done);
  });

  it('should return 404 with invalid id', (done) => {
    request(app)
      .get('/todos/' + 'abcdef')
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should delete a  todo', (done) => {
      var hexId = todos[1]._id.toHexString();

      request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((response) => {
        expect(response.body.todo._id).toBe(hexId);
      })
      .end((error, response) => {
        if (error) {
          return done(error);
        }

      Todo.findById(hexId).then((todo) => {
         expect(todo).toNotExist;
         done();
      }).catch((e) => done());
    });
  });

  it('should return 404 if todo not found', (done) => {
    var hexId = '59fb66fb22c7f09c7ae52889';
    request(app)
    .delete(`/todos/${hexId}`)
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
    .expect(404)
    .end((error, response) => {
      if (error) {
        return done(error);
      }
      done();
    })
  });
});