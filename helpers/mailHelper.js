const nodemailer = require('nodemailer');
require('dotenv').config();

module.exports = {
  // * 관리자 등록 전, 메일 인증 모듈
  emailAuth: (email, authNumber) => {
    // nodemailer로 전송
    const main = async () => {
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.NODEMAILER_USER,
          pass: process.env.NODEMAILER_PASS,
        },
      });

      // send mail with defined transport object
      await transporter.sendMail({
        from: `"WDMA Team" <${process.env.NODEMAILER_USER}>`,
        to: email,
        subject: 'WDMA Auth Number',
        text: authNumber,
        html: `<b>${authNumber}</b>`,
      });
    };

    main().catch(console.error);
  },
};
