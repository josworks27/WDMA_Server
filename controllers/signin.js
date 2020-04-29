const { users } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = {
  // * POST: /signin
  postSignin: async (req, res) => {
    const { email, password } = req.body;

    try {
      const userCheckResult = await users.findOne({ where: { email: email } });

      if (userCheckResult) {
        const userData = userCheckResult.dataValues;
        const isCorrectPassword = await bcrypt.compare(
          password,
          userData.password
        );

        if (isCorrectPassword) {
          const token = jwt.sign(
            {
              userId: userData.id,
              email: userData.email,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: '6h',
            }
          );

          res.status(200).json({
            status: 'Success',
            code: 200,
            token: token,
            userId: userData.id,
            userName: userData.name,
          });
        } else {
          res.status(401).json({
            status: 'Fail',
            code: 401,
            message: 'Invalid password',
          });
        }
      } else {
        res.status(404).json({
          status: 'Fail',
          code: 404,
          message: 'Non-existent Email',
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
