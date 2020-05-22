const { stores, users } = require('../models');
const mailHelper = require('../helpers/mailHelper');

let authNumberStorage = {};

module.exports = {
  // * POST: /auth
  postAuth: async (req, res) => {
    const { email } = req.body;

    // 이메일 존재 체크
    let emailResult = await users.findOne({
      where: { email: email },
      raw: true,
    });

    if (emailResult) {
      res.status(409).json({
        status: 'Fail',
        code: 409,
        message: 'Existing email',
      });
    } else {
      // 인증번호 생성 모듈
      const generatedAuthNumber = String(
        Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)
      );

      // 이메일: 인증번호 임시 저장
      authNumberStorage[email] = generatedAuthNumber;
      mailHelper.sendEmail(email, 'WDMA Auth Number', generatedAuthNumber);

      res.status(200).json({
        status: 'Success',
        code: 200,
        data: `${email}`,
      });
    }
  },

  // * POST: /auth/check
  postAuthCheck: async (req, res) => {
    const { email, authNumber } = req.body;

    if (!email || !authNumber) {
      res.status(400).json({
        status: 'Fail',
        code: 400,
        message: 'Invalid request',
      });
    } else {
      if (authNumberStorage[email] === authNumber) {
        delete authNumberStorage[email];

        // 점포 디비에서 가져와서 보내주기
        const storesResult = await stores.findAll({
          attributes: ['id', 'name'],
          raw: true,
        });

        res.status(200).json({
          status: 'Success',
          code: 200,
          data: storesResult,
        });
      } else {
        res.status(400).json({
          status: 'Fail',
          code: 400,
          message: 'Incorrect Auth Number',
        });
      }
    }
  },
};
