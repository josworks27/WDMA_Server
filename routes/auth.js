const express = require('express');
const authRouter = express.Router();
const authChecker = require('../middlewares/authChecker');

// controller 가져오기
const authCtrl = require('../controllers/auth');

// Controller 분기하기
authRouter.post('/', authChecker, authCtrl.postAuth);
authRouter.post('/check', authChecker, authCtrl.postAuthCheck);

module.exports = authRouter;
