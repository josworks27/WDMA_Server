const { users, stores, dresses, events, customers } = require('../models');

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
  putUsers: (req, res) => {
    res.send('put users');
  },
};
