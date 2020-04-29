const express = require('express');
const userRouter = express.Router();

// controller 가져오기
const userCtrl = require('../controllers/user');

// Controller 분기하기
userRouter.get('/:id', userCtrl.getUsers);
userRouter.put('/:id', userCtrl.putUsers);

module.exports = userRouter;
