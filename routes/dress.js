const express = require('express');
const dressRouter = express.Router();

// controller 가져오기
const dressCtrl = require('../controllers/dress');

// Controller 분기하기
dressRouter.get('/', dressCtrl.getDresses);
dressRouter.post('/', dressCtrl.postDresses);
dressRouter.post('/search', dressCtrl.postDressesSearch);
dressRouter.get('/stats', dressCtrl.getDressesStats);
dressRouter.get('/:id', dressCtrl.getDressDetail);
dressRouter.put('/:id', dressCtrl.putDressDetail);
dressRouter.delete('/:id', dressCtrl.deleteDressDetail);
dressRouter.post('/:id/events', dressCtrl.postDressEvent);
dressRouter.put('/:id/events/:id', dressCtrl.putDressEvent);
dressRouter.delete('/:id/events/:id', dressCtrl.deleteDressEvent);

module.exports = dressRouter;
