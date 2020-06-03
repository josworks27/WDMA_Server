const express = require('express');
const userRouter = express.Router();
const authChecker = require('../middlewares/authChecker');

// controller 가져오기
const userCtrl = require('../controllers/user');

// Controller 분기하기
userRouter.get('/', authChecker, userCtrl.getUsers);
userRouter.put('/', authChecker, userCtrl.putUsers);
userRouter.put('/password', authChecker, userCtrl.putPassword);

module.exports = userRouter;
