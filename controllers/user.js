const bcrypt = require('bcrypt');
const { users, stores, dresses, events, customers } = require('../models');
require('dotenv').config();

module.exports = {
  // * GET: /users/:id
  getUsers: async (req, res) => {
    // 유저 정보 => 이메일, 이름, 소속점포
    // 이벤트 정보 => 자신이 작성한 모든 드레스의 이벤트 내역 (최신순)
    //    날짜(최신순), 모델(A-Z), 이벤트(최신순)
    const { id } = req.params;

    try {
      // 유저 정보 가져오기
      const findUserResult = await users.findOne({
        where: { id: id },
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
          where: { userId: id },
          order: [['date', 'DESC']],
          include: [
            { model: dresses, attributes: ['model'] },
            { model: customers, attributes: ['name'] },
          ],
          attributes: ['type', 'date', 'details'],
          raw: true,
        });

        if (findEventsResult.length === 0) {
          res.status(404).json({
            status: 'Fail',
            code: 404,
            message: 'Not found',
          });
        } else {
          res.status(200).json({
            status: 'Success',
            code: 200,
            userData: findUserResult,
            eventData: findEventsResult,
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

  // * PUT: /users/:id
  putUsers: async (req, res) => {
    // * 계정 비밀번호 변경
    // req.body로 기존 비밀번호와 신규 비밀번호 확인
    // id에 맞는 유저 리소소를 가져와서 기존 비밀번호가 맞는지 먼저 확인.
    // 맞으면? 신규 비밀번호로 업데이트 후 응답
    // 틀리면? 틀리다는 응답
    const { oldPass, newPass } = req.body;
    const { id } = req.params;

    console.log(oldPass, newPass);

    try {
      const findPassResult = await users.findOne({
        where: { id: id },
        attributes: ['password'],
        raw: true,
      });

      console.log(findPassResult);

      if (!findPassResult) {
        res.status(404).json({
          status: 'Fail',
          code: 404,
          message: 'Non-existent user',
        });
      } else {
        // 비번 확인
        const isCorrectPassword = await bcrypt.compare(
          oldPass,
          findPassResult.password
        );

        console.log(isCorrectPassword);

        if (isCorrectPassword) {
          // 신규 비번으로 업데이트
          await users.update(
            {
              password: newPass,
            },
            { where: { id: id } }
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
