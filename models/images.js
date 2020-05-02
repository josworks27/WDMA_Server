/* eslint-disable no-unused-vars */
'use strict';
module.exports = (sequelize, DataTypes) => {
  const images = sequelize.define(
    'images',
    {
      filePath: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fileName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mainImage: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      dressId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {}
  );
  images.associate = function (models) {
    // associations can be defined here
    images.belongsTo(models.dresses, {
      foreignKey: 'dressId',
    });
  };
  return images;
};
