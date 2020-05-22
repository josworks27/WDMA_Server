const express = require('express');
const findRouter = express.Router();

// controller 가져오기
const findCtrl = require('../controllers/find');

// Controller 분기하기
findRouter.get('/', findCtrl.getFind);
findRouter.post('/', findCtrl.postFind);
findRouter.put('/', findCtrl.putFind);

module.exports = findRouter;
