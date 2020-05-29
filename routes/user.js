const express = require('express');
const userRouter = express.Router();
const authChecker = require('../middlewares/authChecker');

// controller 가져오기
const userCtrl = require('../controllers/user');

// Controller 분기하기
userRouter.get('/:id', authChecker, userCtrl.getUsers);
userRouter.put('/:id', authChecker, userCtrl.putUsers);

module.exports = userRouter;
