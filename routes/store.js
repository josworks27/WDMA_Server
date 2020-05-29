const express = require('express');
const storeRouter = express.Router();

// controller 가져오기
const storeCtrl = require('../controllers/store');

// Controller 분기하기
storeRouter.get('/', storeCtrl.getStore);

module.exports = storeRouter;
