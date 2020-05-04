const jwt = require('jsonwebtoken');
const { dresses, images, stores, events, customers } = require('../models');
require('dotenv').config();

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
      if (!model) {
        res.status(400).json({
          status: 'Fail',
          code: 400,
          message: 'Invalid requset',
        });
      } else {
        const dressResult = await dresses.findAll({
          where: { model: model },
          attributes: ['model'],
          include: [
            {
              model: images,
              required: false,
              where: {
                mainImage: true,
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
  getDressesStats: (req, res) => {
    // 드레스 통계
    // 고객정보와 드레스 이벤트 연계해서 고민해보기
    res.send('get dresses stats');
  },

  // * GET: /dresses/:dressId
  getDressDetail: async (req, res) => {
    // 드레스 상세
    const { dressId } = req.params;

    try {
      // dresses, events에서 리소스 가져오기
      // 있으면? 리소스 응답
      // 없으면? 없다고 응답
      const findDressResult = await dresses.findOne({
        where: { id: dressId },
        include: [{ model: stores }],
        raw: true,
      });

      const findEventsResult = await events.findAll({
        where: { dressId: dressId },
        include: [{ model: customers }],
        raw: true,
      });

      if (!findDressResult || !findEventsResult) {
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
  // 드레스 상세 수정
  putDressDetail: (req, res) => {
    res.send('put dress detail');
  },

  // * DELETE: /dresses/:dressId
  deleteDressDetail: (req, res) => {
    // 드레스 삭제
    res.send('delete dress detail');
  },

  // * POST: /dresses/:dressId/events
  postDressEvent: async (req, res) => {
    // ! Socket.io
    // event 생성
    // req.body 확인
    // DB 모델에 insert => events, customers
    const {
      eventType,
      date,
      details,
      customerName,
      customerBirth,
      customerGender,
    } = req.body;

    const { dressId } = req.params;
    const token = req.headers.authorization.split('Bearer ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

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
            userId: decoded.userId,
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
            userId: decoded.userId,
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
    // event 수정
    // req.body 확인
    // events update 하기
    const {
      eventType,
      date,
      details,
      customerName,
      customerBirth,
      customerGender,
    } = req.body;

    const { dressId, eventId } = req.params;
    const token = req.headers.authorization.split('Bearer ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

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
                  userId: decoded.userId,
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
                    userId: decoded.userId,
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
                    userId: decoded.userId,
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
            // 고객정보가 없으니까 고객정보 findOrCreate하고 이벤트의 customerId에 id 넣기
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
                  userId: decoded.userId,
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
                  userId: decoded.userId,
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
                  userId: decoded.userId,
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
                  userId: decoded.userId,
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
            // 세탁, 지점대여로 변경
            // 고객정보 null로 바꾸기
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
                  userId: decoded.userId,
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
    // event 삭제
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
