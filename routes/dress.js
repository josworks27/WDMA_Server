const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const path = require('path');
const authChecker = require('../middlewares/authChecker');

const dressRouter = express.Router();

// controller 가져오기
const dressCtrl = require('../controllers/dress');

// Multer 세팅
const dir = __dirname.slice(0, -7);
AWS.config.loadFromPath(`${dir}/config/awsconfig.json`);

const s3 = new AWS.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'wdma-db',
    key: function (req, file, cb) {
      const extension = path.extname(file.originalname);
      cb(null, Date.now().toString() + extension);
    },
    acl: 'public-read-write',
  }),
});

// Controller 분기하기
dressRouter.get('/', authChecker, dressCtrl.getDresses);
dressRouter.post(
  '/',
  authChecker,
  upload.array('images', 3),
  dressCtrl.postDresses
);
dressRouter.post('/search', authChecker, dressCtrl.postDressesSearch);
dressRouter.get('/stats', authChecker, dressCtrl.getDressesStats);
dressRouter.get('/:dressId', authChecker, dressCtrl.getDressDetail);
dressRouter.put(
  '/:dressId',
  authChecker,
  upload.array('images', 3),
  dressCtrl.putDressDetail
);
dressRouter.delete('/:dressId', authChecker, dressCtrl.deleteDressDetail);
dressRouter.post('/:dressId/events', authChecker, dressCtrl.postDressEvent);
dressRouter.put(
  '/:dressId/events/:eventId',
  authChecker,
  dressCtrl.putDressEvent
);
dressRouter.delete(
  '/:dressId/events/:eventId',
  authChecker,
  dressCtrl.deleteDressEvent
);

module.exports = dressRouter;
