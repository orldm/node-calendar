'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class token extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  token.init({
    refreshToken: DataTypes.STRING,
    accessTokenId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'token',
  });
  return token;
};