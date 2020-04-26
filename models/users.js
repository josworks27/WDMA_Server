/* eslint-disable no-unused-vars */
'use strict';
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define(
    'users',
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      manager: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      storeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {}
  );
  users.associate = function (models) {
    // associations can be defined here
    models.users.hasMany(models.chats);
    models.users.hasMany(models.events);

    users.belongsTo(models.stores, {
      foreignKey: 'storeId',
    });
  };
  return users;
};
