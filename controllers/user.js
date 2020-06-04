const bcrypt = require('bcrypt');
const { users, stores, dresses, events, customers } = require('../models');
const eventGroupingHelper = require('../helpers/eventGroupingHelper');

module.exports = {
  // * GET: /users
  getUsers: async (req, res) => {
    const { userId } = req.user;

    try {
      // 유저 정보 가져오기
      const findUserResult = await users.findOne({
        where: { id: userId },
        attributes: ['email', 'name'],
        include: {
          model: stores,
          attributes: ['name'],
        },
        raw: true,
      });

      if (!findUserResult) {
        res.status(404).json({
          status: 'Fail',
          code: 404,
          message: 'Non-existent user',
        });
      } else {
        // 이벤트 정보 가져오기
        const findEventsResult = await events.findAll({
          where: { userId: userId },
          order: [['date', 'DESC']],
          include: [
            {
              model: dresses,
              attributes: ['model'],
              order: [['model', 'ASC']],
            },
            { model: customers, attributes: ['name'] },
          ],
          attributes: ['id', 'type', 'date', 'details'],
          raw: true,
        });

        if (findEventsResult.length === 0) {
          res.status(404).json({
            status: 'Fail',
            code: 404,
            message: 'Not found',
          });
        } else {
          let eventDataResult = eventGroupingHelper(findEventsResult);

          res.status(200).json({
            status: 'Success',
            code: 200,
            userData: findUserResult,
            eventData: eventDataResult,
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

  // * PUT: /users
  putUsers: async (req, res) => {
    const { name, store, manager } = req.body;
    const { userId } = req.user;

    console.log(req.body, userId);

    try {
      const findStoreResult = await stores.findOne({
        where: {
          name: store,
        },
        attributes: ['id'],
        raw: true,
      });

      const updateUserResult = await users.update(
        {
          name: name,
          storeId: findStoreResult.id,
          manager: manager,
        },
        {
          where: {
            id: userId,
          },
        }
      );

      if (updateUserResult.length === 0) {
        res.status(404).json({
          status: 'Fail',
          code: 404,
          message: 'Not found',
        });
      } else {
        res.status(200).json({
          status: 'Success',
          code: 200,
          message: 'Account was updated',
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

  // * PUT: /users/password
  putPassword: async (req, res) => {
    const { currPassword, newPassword } = req.body;
    const { userId } = req.user;

    try {
      const findPassResult = await users.findOne({
        where: { id: userId },
        attributes: ['password'],
        raw: true,
      });

      if (!findPassResult) {
        res.status(404).json({
          status: 'Fail',
          code: 404,
          message: 'Non-existent user',
        });
      } else {
        const isCorrectPassword = await bcrypt.compare(
          currPassword,
          findPassResult.password
        );

        if (isCorrectPassword) {
          await users.update(
            {
              password: newPassword,
            },
            { where: { id: userId } }
          );

          res.status(200).json({
            status: 'Success',
            code: 200,
            message: 'Successfully updated',
          });
        } else {
          res.status(401).json({
            status: 'Fail',
            code: 401,
            message: 'Incorrect password',
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
};
