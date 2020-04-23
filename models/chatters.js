/* eslint-disable no-unused-vars */
'use strict';
module.exports = (sequelize, DataTypes) => {
  const chatters = sequelize.define(
    'chatters',
    {
      log: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {}
  );
  chatters.associate = function (models) {
    // associations can be defined here
  };
  return chatters;
};
