const { dresses, images, stores } = require('../models');

module.exports = {
  // * GET: /dresses
  getDresses: async (req, res) => {
    try {
      const dressesResult = await dresses.findAll({
        attributes: ['model'],
        include: {
          model: images,
          where: {
            mainImage: 1,
          },
          required: true,
          attributes: ['filePath'],
        },
        raw: true,
      });

      res.status(200).json({
        status: 'Success',
        code: 200,
        data: dressesResult,
      });
    } catch (err) {
      res.status(500).json({
        status: 'Fail',
        code: 500,
        message: err.name,
      });
    }
  },

  // * POST: /dresses
  postDresses: async (req, res) => {
    const {
      model,
      price,
      accessoryOne,
      accessoryTwo,
      accessoryThree,
      store,
    } = req.body;

    try {
      if (!model || !price || !store) {
        res.status(400).json({
          status: 'Fail',
          code: 400,
          message: 'Invalid requset',
        });
      } else {
        const storeResult = await stores.findOne({
          where: { name: store },
          attributes: ['id'],
          raw: true,
        });

        // 드레스 추가
        const newDressResult = await dresses.create({
          model: model,
          price: price,
          accessoryOne: accessoryOne,
          accessoryTwo: accessoryTwo,
          accessoryThree: accessoryThree,
          storeId: storeResult['id'],
        });

        const newDressId = newDressResult.dataValues.id;

        // 이미지 추가
        for (let i = 0; i < req.files.length; i++) {
          const isMain = req.files[i].originalname.split('.');

          if (isMain[0] === 'main') {
            await images.create({
              filePath: req.files[i].location,
              fileName: req.files[i].originalname,
              mainImage: true,
              dressId: newDressId,
            });
          } else {
            await images.create({
              filePath: req.files[i].location,
              fileName: req.files[i].originalname,
              mainImage: false,
              dressId: newDressId,
            });
          }
        }

        res.status(200).json({
          status: 'Success',
          code: 200,
          message: newDressId,
        });
      }
    } catch (err) {
      res.status(500).json({
        status: 'Fail',
        code: 500,
        message: err.name,
      });
    }
  },

  // * POST: /dresses/search
  postDressesSearch: async (req, res) => {
    // 모델명으로 드레스 찾기
    // 해당하는 드레스의 메인 이미지 filePath, 모델명 응답하기
    // try {
    // } catch (err) {
    //   res.status(500).json({
    //     status: 'Fail',
    //     code: 500,
    //     message: err.name,
    //   });
    // }
    res.end();
  },

  // * GET: /dresses/stats
  getDressesStats: (req, res) => {
    res.send('get dresses stats');
  },

  // * GET: /dresses/:id
  getDressDetail: (req, res) => {
    res.send('get dress detail');
  },

  // * PUT: /dresses/:id
  putDressDetail: (req, res) => {
    res.send('put dress detail');
  },

  // * DELETE: /dresses/:id
  deleteDressDetail: (req, res) => {
    res.send('delete dress detail');
  },

  // * POST: /dresses/:id/events
  postDressEvent: (req, res) => {
    res.send('post dressses events');
  },

  // * PUT: /dresses/:id/events/:id
  putDressEvent: (req, res) => {
    res.send('put dressses events');
  },

  // * DELETE: /dresses/:id/events/:id
  deleteDressEvent: (req, res) => {
    res.send('delete dressses events');
  },
};
