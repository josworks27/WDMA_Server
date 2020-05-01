const nodemailer = require('nodemailer');
require('dotenv').config();

module.exports = {
  // * 관리자 등록 전, 메일 인증 모듈
  sendEmail: (email, subject, content) => {
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
        subject: subject,
        text: content,
        html: `<b>${content}</b>`,
      });
    };

    main().catch(console.error);
  },
};
