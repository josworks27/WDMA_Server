/* eslint-disable no-unused-vars */
'use strict';
module.exports = (sequelize, DataTypes) => {
  const chats = sequelize.define(
    'chats',
    {
      log: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {}
  );
  chats.associate = function (models) {
    // associations can be defined here
    chats.belongsTo(models.users, {
      foreignKey: 'userId',
    });
  };
  return chats;
};
