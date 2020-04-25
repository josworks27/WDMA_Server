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
    models.stores.hasMany(models.users);
    models.stores.hasMany(models.dresses);
  };
  return stores;
};
