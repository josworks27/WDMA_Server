/* eslint-disable no-unused-vars */
'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'stores',
      [
        {
          name: 'Yokohama',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Omotesando',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('stores', null, {});
  },
};
