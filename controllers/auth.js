const mailHelper = require('../helpers/mailHelper');

let authNumberStorage = {};

module.exports = {
  // * POST: /auth
  postAuth: (req, res) => {
    const { email } = req.body;
    console.log(email);

    if (!email) {
      res.status(400).json({
        status: 'Fail',
        code: 400,
        message: 'Invalid request',
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
        message: 'Sent email',
      });
    }
  },

  // * POST: /auth/check
  postAuthCheck: (req, res) => {
    const { email, authNumber } = req.body;
    console.log(email, authNumber);

    if (!email || !authNumber) {
      res.status(400).json({
        status: 'Fail',
        code: 400,
        message: 'Invalid request',
      });
    } else {
      if (authNumberStorage[email] === authNumber) {
        delete authNumberStorage[email];

        res.status(200).json({
          status: 'Success',
          code: 200,
          message: 'Correct Auth Number',
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
