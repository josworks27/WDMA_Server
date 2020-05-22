const { users, stores } = require('../models');
const mailHelper = require('../helpers/mailHelper');

module.exports = {
  // * GET: /find
  getFind: async (req, res) => {
    // 스토어 리스트 보내주기
    try {
      const storesResult = await stores.findAll({
        attributes: ['id', 'name'],
        raw: true,
      });

      res.status(200).json({
        status: 'Success',
        code: 200,
        data: storesResult,
      });
    } catch (err) {
      res.status(500).json({
        status: 'Fail',
        code: 500,
        message: err.name,
      });
    }
  },

  // * POST: /find
  postFind: async (req, res) => {
    const { name, store } = req.body;

    console.log(name, store);

    try {
      if (!name || !store) {
        res.status(400).json({
          status: 'Fail',
          code: 400,
          message: 'Invalid requset',
        });
      } else {
        const userData = await users.findAll({
          where: {
            name: name,
          },
          attributes: ['email'],
          include: {
            model: stores,
            where: {
              name: store,
            },
            required: true,
            attributes: ['name'],
          },
          raw: true,
        });

        if (userData.length > 0) {
          res.status(200).json({
            status: 'Success',
            code: 200,
            email: userData,
          });
        } else {
          res.status(404).json({
            status: 'Fail',
            code: 404,
            message: 'Not found',
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

  // * PUT: /find
  putFind: async (req, res) => {
    const { email } = req.body;

    try {
      if (!email) {
        res.status(400).json({
          status: 'Fail',
          code: 400,
          message: 'Invalid requset',
        });
      } else {
        const userData = await users.findOne({ where: { email: email } });

        if (userData) {
          // 임의 비밀번호 생성
          const randomString = Math.random().toString(36).slice(2);

          const changedUserData = await users.update(
            { password: randomString },
            {
              where: {
                email: email,
              },
            }
          );

          if (changedUserData) {
            mailHelper.sendEmail(email, 'WDMA new Password', randomString);

            res.status(200).json({
              status: 'Success',
              code: 200,
              message: 'Sent an email containing the new password',
            });
          } else {
            res.status(404).json({
              status: 'Fail',
              code: 404,
              message: 'Not found',
            });
          }
        } else {
          res.status(404).json({
            status: 'Fail',
            code: 404,
            message: 'Not found',
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
