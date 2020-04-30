const nodemailer = require('nodemailer');
require('dotenv').config();

let authNumberStorage = {};

module.exports = {
  // * POST: /auth
  postAuth: (req, res) => {
    // req.body에서 email 확인
    // 인증번호 생성 => 기억하고 있어야 한다. email: 인증번호
    // nodemailer로 해당 이메일로 인증번호 이메일 전송

    const { email } = req.body;
    console.log('email ? ', email);

    // 이메일이 없으면 실패 응답
    if (!email) {
      res.status(400).json({
        status: 'Fail',
        code: 400,
        message: 'Invalid request',
      });
    }

    // ! 인증번호 생성 모듈, 나중에 헬퍼로 분리하기
    const generatedAuthNumber = String(
      Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)
    );
    console.log('Auth number ? ', generatedAuthNumber);

    // ! 이메일: 인증번호 임시 저장
    authNumberStorage[email] = generatedAuthNumber;
    console.log('storage ? ', authNumberStorage);

    // ! nodemailer로 전송
    const main = async () => {
      // Generate test SMTP service account from ethereal.email
      // Only needed if you don't have a real mail account for testing
      // let testAccount = await nodemailer.createTestAccount();

      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.NODEMAILER_USER, // generated ethereal user
          pass: process.env.NODEMAILER_PASS, // generated ethereal password
        },
      });

      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: `"WDMA Team" <${process.env.NODEMAILER_USER}>`, // sender address
        to: email, // list of receivers
        subject: 'WDMA Auth Number', // Subject line
        text: generatedAuthNumber, // plain text body
        html: `<b>${generatedAuthNumber}</b>`, // html body
      });

      console.log('Message sent: %s', info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

      console.log('2');

      res.status(200).json({
        status: 'Success',
        code: 200,
        message: 'Sent Auth Email',
      });
    };

    main().catch(console.error);
    console.log('1');
  },

  // * POST: /auth/check
  postAuthCheck: (req, res) => {
    // req.body에서 email, 인증번호 확인
    // email, 인증번호 비교
    // 틀리면? 틀렸다는 응답
    // 맞으면? 성공했다는 응답
    //    임시저장되어 있던 인증번호 제거
    res.send('auth check');
  },
};
