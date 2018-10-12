// routing , path , method name

var express = require('express');
var route = express.Router();
var todoCont = require('../controller/todoListController');
var validate = require('express-validation');
var validation = require('../test/validation/signup.js');
var loginValidation = require('../test/validation/login.js');
var addContact = require('../test/validation/addContact.js');
var getContact = require('../test/validation/getContact.js');
var deleteContact = require('../test/validation/deleteContact.js');
require('../config/dbconstant.js')




// 1. signup user
route.post(signupApiMethod, validate(validation), todoCont.signup)

// 2. Login
route.post(loginApiMethod, validate(loginValidation), todoCont.login);

// 3. Add connect

route.post(addContactApiMethod, validate(addContact), todoCont.addContact);

// 4. get contact list
route.get(getAllContactApiMethod, validate(getContact), todoCont.getAllContact);

// get profile
route.get(getProfileApiMethod, validate(getContact), todoCont.getProfile)

// delete contact
route.post(deleteContactApiMethod, validate(deleteContact), todoCont.deleteRecord);




module.exports = route;