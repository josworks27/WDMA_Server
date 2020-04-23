/* eslint-disable no-unused-vars */
'use strict';
module.exports = (sequelize, DataTypes) => {
  const dresses = sequelize.define(
    'dresses',
    {
      model: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      accesoryOne: {
        type: DataTypes.STRING,
      },
      accesoryTwo: {
        type: DataTypes.STRING,
      },
      accesoryThree: {
        type: DataTypes.STRING,
      },
    },
    {}
  );
  dresses.associate = function (models) {
    // associations can be defined here
  };
  return dresses;
};
