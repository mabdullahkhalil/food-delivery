'use strict';
module.exports = (app) =>  {
  var users = require('../api/controllers/creatingUser');

  // todoList Routes
  app.route('/createUser')
    .post(users.create_user);


};