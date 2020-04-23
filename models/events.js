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
        type: DataTypes.DATE,
        allowNull: false,
      },
      details: {
        type: DataTypes.TEXT,
      },
    },
    {}
  );
  events.associate = function (models) {
    // associations can be defined here
  };
  return events;
};
