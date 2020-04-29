/* eslint-disable no-unused-vars */
'use strict';
module.exports = (sequelize, DataTypes) => {
  const customers = sequelize.define(
    'customers',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {}
  );
  customers.associate = function (models) {
    // associations can be defined here
    models.customers.hasMany(models.events);
  };
  return customers;
};
