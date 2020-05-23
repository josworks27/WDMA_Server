const express = require('express');
const forgotRouter = express.Router();

// controller 가져오기
const forgotCtrl = require('../controllers/forgot');

// Controller 분기하기
forgotRouter.get('/', forgotCtrl.getFind);
forgotRouter.post('/', forgotCtrl.postFind);
forgotRouter.put('/', forgotCtrl.putFind);

module.exports = forgotRouter;
