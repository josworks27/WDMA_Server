const { dresses, images, stores, events, customers } = require('../models');
require('dotenv').config();

module.exports = {
  // * GET: /dresses
  getDresses: async (req, res) => {
    try {
      const dressesResult = await dresses.findAll({
        attributes: ['id', 'model'],
        order: [['model', 'ASC']],
        include: {
          model: images,
          where: {
            mainImage: 1,
          },
          required: false,
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
      // 이미 있는 모델인지 확인
      const dressResult = await dresses.findOne({
        where: { model: model },
        raw: true,
      });

      if (dressResult) {
        res.status(409).json({
          status: 'Fail',
          code: 409,
          message: 'Existing dress',
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

        if (req.files.length > 0) {
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
        }

        res.status(200).json({
          status: 'Success',
          code: 200,
          data: newDressId,
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
    const { model } = req.body;

    try {
      const dressResult = await dresses.findAll({
        where: { model: model },
        attributes: ['id', 'model'],
        include: [
          {
            model: images,
            required: false,
            where: {
              mainImage: 1,
            },
            attributes: ['filePath'],
          },
        ],
        raw: true,
      });

      if (dressResult.length === 0) {
        res.status(404).json({
          status: 'Fail',
          code: 404,
          message: 'Not found',
        });
      } else {
        res.status(200).json({
          status: 'Success',
          code: 200,
          data: dressResult,
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

  // * GET: /dresses/stats
  getDressesStats: async (req, res) => {
    // 드레스 통계
    try {
      // * 1. 드레스별 이벤트 랭킹
      const allDressEvents = await events.findAll({
        include: [{ model: dresses, attributes: ['model'] }],
        order: [['dressId', 'ASC']],
        raw: true,
      });

      // 드레스 모델별 분리
      let statsByDress = [];
      let tempStats = { model: null, stats: {} };

      for (let i = 0; i < allDressEvents.length; i++) {
        if (
          tempStats['model'] === null ||
          tempStats['model'] === allDressEvents[i]['dress.model']
        ) {
          // null 바꾸기
          if (tempStats['model'] === null) {
            tempStats['model'] = allDressEvents[i]['dress.model'];
          }

          // stats 처리
          if (
            Object.prototype.hasOwnProperty.call(
              tempStats['stats'],
              allDressEvents[i]['type']
            )
          ) {
            tempStats['stats'][allDressEvents[i]['type']] += 1;
          } else {
            tempStats['stats'][allDressEvents[i]['type']] = 1;
          }
        } else {
          statsByDress.push(tempStats);
          tempStats = { model: null, stats: {} };

          tempStats['model'] = allDressEvents[i]['dress.model'];
          tempStats['stats'][allDressEvents[i]['type']] = 1;
        }

        if (i === allDressEvents.length - 1) {
          statsByDress.push(tempStats);
        }
      }

      // * 2. 모든 드레스 이벤트 랭킹
      let statsByAllDress = {};
      for (let i = 0; i < allDressEvents.length; i++) {
        if (
          Object.prototype.hasOwnProperty.call(
            statsByAllDress,
            allDressEvents[i]['type']
          )
        ) {
          statsByAllDress[allDressEvents[i]['type']] += 1;
        } else {
          statsByAllDress[allDressEvents[i]['type']] = 1;
        }
      }

      res.status(200).json({
        status: 'Success',
        code: 200,
        statsData: {
          statsByDress: statsByDress,
          statsByAllDress: statsByAllDress,
        },
      });

      // * 3. 연령대별 드레스 랭킹 (일단 보류, 향후 필요시 추가)
    } catch (err) {
      res.status(500).json({
        status: 'Fail',
        code: 500,
        message: err.name,
      });
    }
  },

  // * GET: /dresses/:dressId
  getDressDetail: async (req, res) => {
    const { dressId } = req.params;

    try {
      const findDressResult = await dresses.findOne({
        where: { id: dressId },
        include: [{ model: stores, attributes: ['name'] }],
        attributes: [
          'id',
          'model',
          'price',
          'accessoryOne',
          'accessoryTwo',
          'accessoryThree',
        ],
        raw: true,
      });

      const findEventsResult = await events.findAll({
        where: { dressId: dressId },
        include: [
          {
            model: customers,
            attributes: ['id', 'name', 'birth', 'gender'],
          },
        ],
        attributes: ['id', 'type', 'date', 'details'],
        order: [['date', 'DESC']],
        raw: true,
      });

      // 이미지 가져오기
      const findImagesResult = await images.findAll({
        where: { dressId: dressId },
        attributes: ['id', 'filePath', 'fileName'],
        raw: true,
      });

      if (!findDressResult) {
        res.status(404).json({
          status: 'Fail',
          code: 404,
          message: 'Not found',
        });
      } else {
        res.status(200).json({
          status: 'Success',
          code: 200,
          dressData: findDressResult,
          eventData: findEventsResult,
          imageData: findImagesResult,
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

  // * PUT: /dresses/:dressId
  putDressDetail: async (req, res) => {
    const {
      model,
      price,
      accessoryOne,
      accessoryTwo,
      accessoryThree,
      store,
    } = req.body;

    const { dressId } = req.params;

    try {
      if (req.files.length > 0) {
        // 새로운 이미지가 존재하면 기존 이미지 삭제하고 새로운 이미지 넣기
        await images.destroy({
          where: {
            dressId: dressId,
          },
        });

        // 새 이미지 생성
        for (let i = 0; i < req.files.length; i++) {
          const isMain = req.files[i].originalname.split('.');

          if (isMain[0] === 'main') {
            await images.create({
              filePath: req.files[i].location,
              fileName: req.files[i].originalname,
              mainImage: true,
              dressId: dressId,
            });
          } else {
            await images.create({
              filePath: req.files[i].location,
              fileName: req.files[i].originalname,
              mainImage: false,
              dressId: dressId,
            });
          }
        }
      }

      const storeResult = await stores.findOne({
        where: { name: store },
        attributes: ['id'],
        raw: true,
      });

      const updatedDressResult = await dresses.update(
        {
          model: model,
          price: price,
          accessoryOne: accessoryOne,
          accessoryTwo: accessoryTwo,
          accessoryThree: accessoryThree,
          storeId: storeResult.id,
        },
        { where: { id: dressId } }
      );

      if (updatedDressResult.length > 0) {
        const findDressResult = await dresses.findOne({
          where: { id: dressId },
          include: [{ model: stores, attributes: ['name'] }],
          attributes: [
            'id',
            'model',
            'price',
            'accessoryOne',
            'accessoryTwo',
            'accessoryThree',
          ],
          raw: true,
        });

        const findImagesResult = await images.findAll({
          where: { dressId: dressId },
          attributes: ['id', 'filePath', 'fileName'],
          raw: true,
        });

        res.status(200).json({
          status: 'Success',
          code: 200,
          dressData: findDressResult,
          imageData: findImagesResult,
        });
      } else {
        res.status(404).json({
          status: 'Fail',
          code: 404,
          message: 'Non-existent dress',
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

  // * DELETE: /dresses/:dressId
  deleteDressDetail: async (req, res) => {
    const { dressId } = req.params;

    try {
      const deletedDressResult = await dresses.destroy({
        where: {
          id: dressId,
        },
      });

      if (deletedDressResult) {
        res.status(200).json({
          status: 'Success',
          code: 200,
          message: 'Successfully deleted',
        });
      } else {
        res.status(404).json({
          status: 'Fail',
          code: 404,
          message: 'Non-existent dress',
        });
      }
    } catch (err) {
      res.status(500).json({
        status: 'Fail',
        code: 500,
        message: err,
      });
    }
  },

  // * POST: /dresses/:dressId/events
  postDressEvent: async (req, res) => {
    // ! Socket.io
    const {
      eventType,
      date,
      details,
      customerName,
      customerBirth,
      customerGender,
    } = req.body;

    const { dressId } = req.params;
    const { userId } = req.user;

    try {
      if (!eventType || !date) {
        res.status(400).json({
          status: 'Fail',
          code: 400,
          message: 'Invalid requset',
        });
      } else {
        if (eventType === 'customerRent' || eventType === 'fitting') {
          const [customer] = await customers.findOrCreate({
            where: {
              name: customerName,
              birth: customerBirth,
              gender: customerGender,
            },
            defaults: {
              name: customerName,
              birth: customerBirth,
              gender: customerGender,
            },
          });

          const newEventResult = await events.create({
            type: eventType,
            date: date,
            details: details,
            dressId: dressId,
            userId: userId,
            customerId: customer.dataValues.id,
          });

          res.status(200).json({
            status: 'Success',
            code: 200,
            eventId: newEventResult.dataValues.id,
          });
        } else if (eventType === 'cleaning' || eventType === 'storeRent') {
          const newEventResult = await events.create({
            type: eventType,
            date: date,
            details: details,
            dressId: dressId,
            userId: userId,
            customerId: null,
          });

          res.status(200).json({
            status: 'Success',
            code: 200,
            eventId: newEventResult.dataValues.id,
          });
        }
      }
    } catch (err) {
      res.status(500).json({
        status: 'Fail',
        code: 500,
        message: err.name,
      });
    }
  },

  // * PUT: /dresses/:dressId/events/:eventId
  putDressEvent: async (req, res) => {
    // ! Socket.io
    const {
      eventType,
      date,
      details,
      customerName,
      customerBirth,
      customerGender,
    } = req.body;

    const { dressId, eventId } = req.params;
    const { userId } = req.user;

    try {
      if (!eventType || !date) {
        res.status(400).json({
          status: 'Fail',
          code: 400,
          message: 'Invalid requset',
        });
      } else {
        // ! 기존 이벤트 데이터 찾기
        const findEventResult = await events.findOne({
          where: { id: eventId, dressId: dressId },
          include: [{ model: customers }],
          raw: true,
        });

        if (eventType === 'customerRent' || eventType === 'fitting') {
          // 원래 대여, 시착일 때
          // 이벤트, 고객정보 변경 사항 업데이트
          if (
            findEventResult.type === 'customerRent' ||
            findEventResult.type === 'fitting'
          ) {
            // 변경사항 업데이트
            if (
              findEventResult.type !== eventType ||
              findEventResult.date !== date ||
              findEventResult.details !== details
            ) {
              await events.update(
                {
                  type: eventType,
                  date: date,
                  details: details,
                  userId: userId,
                },
                {
                  where: {
                    id: findEventResult.id,
                  },
                }
              );
            }

            if (
              findEventResult['customer.name'] !== customerName ||
              findEventResult['customer.birth'] !== customerBirth ||
              findEventResult['customer.gender'] !== customerGender
            ) {
              const [customer, created] = await customers.findOrCreate({
                where: {
                  name: customerName,
                  birth: customerBirth,
                  gender: customerGender,
                },
                defaults: {
                  name: customerName,
                  birth: customerBirth,
                  gender: customerGender,
                },
              });

              if (!created) {
                await events.update(
                  {
                    userId: userId,
                    customerId: customer.id,
                  },
                  {
                    where: {
                      id: findEventResult.id,
                    },
                  }
                );
              } else {
                // 새로 만든 고객정보 찾아서 id 넣기
                const newCustomerResult = await customers.findOne({
                  where: {
                    name: customerName,
                    birth: customerBirth,
                    gender: customerGender,
                  },
                  raw: true,
                });

                await events.update(
                  {
                    userId: userId,
                    customerId: newCustomerResult.id,
                  },
                  {
                    where: {
                      id: findEventResult.id,
                    },
                  }
                );
              }
            }

            res.status(200).json({
              status: 'Success',
              code: 200,
              message: '기존: 대여, 시착 / 변경: 대여, 시착',
            });
          } else {
            // ! 세탁, 지점대여 => 대여, 시착
            // 변경사항 업데이트
            if (
              findEventResult.type !== eventType ||
              findEventResult.date !== date ||
              findEventResult.details !== details
            ) {
              await events.update(
                {
                  type: eventType,
                  date: date,
                  details: details,
                  userId: userId,
                },
                {
                  where: {
                    id: findEventResult.id,
                  },
                }
              );
            }

            const [customer, created] = await customers.findOrCreate({
              where: {
                name: customerName,
                birth: customerBirth,
                gender: customerGender,
              },
              defaults: {
                name: customerName,
                birth: customerBirth,
                gender: customerGender,
              },
            });

            if (!created) {
              await events.update(
                {
                  userId: userId,
                  customerId: customer.id,
                },
                {
                  where: {
                    id: findEventResult.id,
                  },
                }
              );
            } else {
              // 새로 만든 고객정보 찾아서 id 넣기
              const newCustomerResult = await customers.findOne({
                where: {
                  name: customerName,
                  birth: customerBirth,
                  gender: customerGender,
                },
                raw: true,
              });

              await events.update(
                {
                  userId: userId,
                  customerId: created.id,
                },
                {
                  where: {
                    id: newCustomerResult.id,
                  },
                }
              );
            }

            res.status(200).json({
              status: 'Success',
              code: 200,
              message: '기존: 세탁, 지점대여 / 변경: 대여, 시착',
            });
          }
        } else if (eventType === 'cleaning' || eventType === 'storeRent') {
          // ! 세탁, 지점대여 => 세탁, 지점대여
          // 이벤트만 변경, 고객정보는 null 그대로 두기
          if (
            findEventResult.type === 'cleaning' ||
            findEventResult.type === 'storeRent'
          ) {
            // 변경사항 업데이트
            if (
              findEventResult.type !== eventType ||
              findEventResult.date !== date ||
              findEventResult.details !== details
            ) {
              await events.update(
                {
                  type: eventType,
                  date: date,
                  details: details,
                  userId: userId,
                  customerId: null,
                },
                {
                  where: {
                    id: findEventResult.id,
                  },
                }
              );
            }

            res.status(200).json({
              status: 'Success',
              code: 200,
              message: '기존: 세탁, 지점대여 / 변경: 세탁, 지점대여',
            });
          } else {
            // ! 대여, 시착 => 세탁, 지점대여
            // 변경사항 업데이트
            if (
              findEventResult.type !== eventType ||
              findEventResult.date !== date ||
              findEventResult.details !== details
            ) {
              await events.update(
                {
                  type: eventType,
                  date: date,
                  details: details,
                  userId: userId,
                  customerId: null,
                },
                {
                  where: {
                    id: findEventResult.id,
                  },
                }
              );
            }

            res.status(200).json({
              status: 'Success',
              code: 200,
              message: '기존: 대여, 시착 / 변경: 세탁, 지점대여',
            });
          }
        }
      }
    } catch (err) {
      res.status(500).json({
        status: 'Fail',
        code: 500,
        message: err.name,
      });
    }
  },

  // * DELETE: /dresses/:dressId/events/:eventId
  deleteDressEvent: async (req, res) => {
    // ! Socket.io
    const { dressId, eventId } = req.params;

    try {
      const deletedEventResult = await events.destroy({
        where: {
          id: eventId,
          dressId: dressId,
        },
      });

      if (deletedEventResult) {
        res.status(200).json({
          status: 'Success',
          code: 200,
          message: 'Deleted event data',
        });
      } else {
        res.status(404).json({
          status: 'Fail',
          code: 404,
          message: 'Not found',
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
};
