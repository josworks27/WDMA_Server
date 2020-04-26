const express = require('express');
const signinRouter = express.Router();

// controller 가져오기
const signinCtr = require('../controllers/signin');

// Controller 분기하기
signinRouter.post('/signin', signinCtr.post);

module.exports = signinRouter;
