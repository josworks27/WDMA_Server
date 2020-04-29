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
      storeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      imageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {}
  );
  dresses.associate = function (models) {
    // associations can be defined here
    models.dresses.hasMany(models.events);

    dresses.belongsTo(models.stores, {
      foreignKey: 'storeId',
    });
  };
  return dresses;
};
