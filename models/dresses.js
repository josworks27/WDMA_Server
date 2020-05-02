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
      accessoryOne: {
        type: DataTypes.STRING,
      },
      accessoryTwo: {
        type: DataTypes.STRING,
      },
      accessoryThree: {
        type: DataTypes.STRING,
      },
      storeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {}
  );
  dresses.associate = function (models) {
    // associations can be defined here
    models.dresses.hasMany(models.events);
    models.dresses.hasMany(models.images);

    dresses.belongsTo(models.stores, {
      foreignKey: 'storeId',
    });
  };
  return dresses;
};
