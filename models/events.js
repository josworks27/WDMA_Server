/* eslint-disable no-unused-vars */
'use strict';
module.exports = (sequelize, DataTypes) => {
  const events = sequelize.define(
    'events',
    {
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      details: {
        type: DataTypes.TEXT,
      },
      dressId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      customerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {}
  );
  events.associate = function (models) {
    // associations can be defined here
    events.belongsTo(models.dresses, {
      foreignKey: 'dressId',
    });
    events.belongsTo(models.users, {
      foreignKey: 'userId',
    });
    events.belongsTo(models.customers, {
      foreignKey: 'customerId',
    });
  };
  return events;
};
