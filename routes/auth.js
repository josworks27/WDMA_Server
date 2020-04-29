const express = require('express');
const authRouter = express.Router();

// controller 가져오기
const authCtrl = require('../controllers/auth');

// Controller 분기하기
authRouter.post('/', authCtrl.postAuth);
authRouter.post('/check', authCtrl.postAuthCheck);

module.exports = authRouter;
