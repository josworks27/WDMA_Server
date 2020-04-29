const express = require('express');
const chatRouter = express.Router();

// controller 가져오기
const chatCtrl = require('../controllers/chat');

// Controller 분기하기
chatRouter.get('/', chatCtrl.getChat);
chatRouter.post('/', chatCtrl.postChat);

module.exports = chatRouter;
