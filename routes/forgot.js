const express = require('express');
const forgotRouter = express.Router();

// controller 가져오기
const forgotCtrl = require('../controllers/forgot');

// Controller 분기하기
forgotRouter.get('/', forgotCtrl.getForgot);
forgotRouter.post('/', forgotCtrl.postForgot);
forgotRouter.put('/', forgotCtrl.putForgot);

module.exports = forgotRouter;
