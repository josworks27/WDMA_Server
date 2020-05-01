const express = require('express');
const dressRouter = express.Router();
const authChecker = require('../middlewares/authChecker');

// controller 가져오기
const dressCtrl = require('../controllers/dress');

// Controller 분기하기
dressRouter.get('/', authChecker, dressCtrl.getDresses);
dressRouter.post('/', authChecker, dressCtrl.postDresses);
dressRouter.post('/search', authChecker, dressCtrl.postDressesSearch);
dressRouter.get('/stats', authChecker, dressCtrl.getDressesStats);
dressRouter.get('/:id', authChecker, dressCtrl.getDressDetail);
dressRouter.put('/:id', authChecker, dressCtrl.putDressDetail);
dressRouter.delete('/:id', authChecker, dressCtrl.deleteDressDetail);
dressRouter.post('/:id/events', authChecker, dressCtrl.postDressEvent);
dressRouter.put('/:id/events/:id', authChecker, dressCtrl.putDressEvent);
dressRouter.delete('/:id/events/:id', authChecker, dressCtrl.deleteDressEvent);

module.exports = dressRouter;
