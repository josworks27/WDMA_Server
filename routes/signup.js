const express = require('express');
const signupRouter = express.Router();

// controller 가져오기
const signupCtrl = require('../controllers/signup');

// Controller 분기하기
signupRouter.post('/', signupCtrl.postSignup);

module.exports = signupRouter;
