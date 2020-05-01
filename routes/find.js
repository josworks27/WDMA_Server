const express = require('express');
const findRouter = express.Router();
const authChecker = require('../middlewares/authChecker');

// controller 가져오기
const findCtrl = require('../controllers/find');

// Controller 분기하기
findRouter.post('/', authChecker, findCtrl.postFind);
findRouter.put('/', authChecker, findCtrl.putFind);

module.exports = findRouter;
