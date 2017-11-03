var {User} = require('./../models/user');

var authenticate = (request, response, next) => {

  var token = request.header('x-auth');
  
    User.findByToken(token).then((user) => {
      if (!user) {
        return Promise.reject();
      }
  
      request.user = user;
      request.token = token;
      next();
    }).catch((e) => {
      response.sendStatus(401).send(); // Authentication required
    });
}

module.exports = {authenticate};