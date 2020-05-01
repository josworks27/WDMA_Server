const express = require('express');
const chatRouter = express.Router();
const authChecker = require('../middlewares/authChecker');

// controller 가져오기
const chatCtrl = require('../controllers/chat');

// Controller 분기하기
chatRouter.get('/', authChecker, chatCtrl.getChat);
chatRouter.post('/', authChecker, chatCtrl.postChat);

module.exports = chatRouter;
