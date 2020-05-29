const { stores } = require('../models');

module.exports = {
  // * GET: /store
  getStore: async (req, res) => {
    // 스토어 리스트 응답하기
    try {
      const storeList = await stores.findAll({
        attributes: ['id', 'name'],
        raw: true,
      });

      res.status(200).json({
        status: 'Success',
        code: 200,
        data: storeList,
      });
    } catch (err) {
      res.status(500).json({
        status: 'Fail',
        code: 500,
        message: err.name,
      });
    }
  },
};
