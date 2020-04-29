const express = require('express');
const signinRouter = express.Router();

// controller 가져오기
const signinCtrl = require('../controllers/signin');

// Controller 분기하기
signinRouter.post('/', signinCtrl.postSignin);

module.exports = signinRouter;
