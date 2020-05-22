const { users, stores } = require('../models');

module.exports = {
  // * POST: /signup
  postSignup: async (req, res) => {
    const { email, password, name, store, manager } = req.body;

    try {
      const emailCheckResult = await users.findOne({ where: { email: email } });

      if (!emailCheckResult) {
        const storeCheckResult = await stores.findOne({
          where: { name: store },
        });

        if (storeCheckResult) {
          const result = await users
            .create({
              email: email,
              password: password,
              name: name,
              manager: manager,
              storeId: storeCheckResult.dataValues.id,
            })
            .catch((err) => {
              res.status(500).json({
                status: 'Fail',
                code: 500,
                message: err.name,
              });
            });

          res.status(200).json({
            status: 'Success',
            code: 200,
            data: {
              userId: result.id,
            },
          });
        } else {
          res.status(500).json({
            status: 'Fail',
            code: 500,
            message: 'Non-existent store',
          });
        }
      } else {
        res.status(409).json({
          status: 'Fail',
          code: 409,
          message: 'Email already exists',
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
