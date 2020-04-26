const express = require('express');
const signupRouter = express.Router();

// controller 가져오기
const signupCtr = require('../controllers/signup');

// Controller 분기하기
signupRouter.post('/signin', signupCtr.post);

module.exports = signupRouter;
