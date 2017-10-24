const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// var id = '69ef59d4ca596fcd10abb600';

// if (!ObjectID.isValid(id)) {
//   console.error('ID not valid');
// }

// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos', todos);
// });

// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo', todo);
// });

// Todo.findById(id).then((todoById) => {
//   if (!todoById) {
//     return console.log('Id not found');
//   }
//   console.log('Todo by Id', todoById);
// }).catch((e) => {
//   console.error(e);
// });

User.findById('59e692cc706ace62421ea817').then((user) => {
  if (!user) {
    return console.error('Unable to find user');
  }

  console.log(JSON.stringify(user, undefined, 2));
}, (error) => {
  console.error(error);
});