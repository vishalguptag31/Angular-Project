var express = require('express');
var routes = express.Router();
var authentication = require('../controller/authentication/auth-controller');
var user = require('../controller/user/user-controller');
var common = require('../controller/common/common-controller');
var auth = require('../utils/auth')

routes.post('/login', authentication.authenticate);
routes.get('/getUser/:id', user.getUserDetail);
routes.post('/userSignUp', authentication.userSignUp);
routes.post('/mailVerification', authentication.validateEmailLink);
routes.post('/resendEmailVerification',authentication.resendEmailVerification)

// New
routes.get('/getAssigneeList/:id', auth.verify, user.getUserDetail)
routes.post('/addUserRelation', auth.verify, user.addUserRelation)
routes.get('/getcategory/:added_by', common.getcategory);
routes.post('/changePassword', authentication.changePassword);

// TASK
routes.post('/addTask', user.addTask);
routes.put('/updateTask/:id', user.updateTask);
routes.delete('/deleteTask/:id', user.deleteTask);
routes.get('/getAllTasks/:id', auth.verify ,user.getAllTasks)
routes.get('/getTaskById/:id', user.getTaskById);
routes.get('/checkCategoryTaskExist/:id', user.checkCategoryTaskExist);
routes.post('/updateStatus', user.updateStatus)
routes.post('/sendQuery', user.sendStatus)
routes.post('/searchAllTasks', user.searchTasks)
routes.post('/addUserAssignee', user.addUserAssignee)
routes.post('/saveCategory', user.saveCategoryData)
routes.get('/checkUniqueEmail/:email', user.checkUniqueEmail);
routes.get('/checkUniquePhoneNumber/:phone_number', user.checkUniquePhoneNumber);
routes.delete('/deleteCategoryById/:id',user.deleteCategoryById);
routes.post('/upadateCategory', user.upadateCategory)
routes.post('/updatePollStatus',auth.verify, user.updatePollStatus)

module.exports = routes;