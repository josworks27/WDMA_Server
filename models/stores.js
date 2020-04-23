/* eslint-disable no-unused-vars */
'use strict';
module.exports = (sequelize, DataTypes) => {
  const stores = sequelize.define(
    'stores',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {}
  );
  stores.associate = function (models) {
    // associations can be defined here
  };
  return stores;
};
