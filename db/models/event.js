"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    static associate(models) {
      Event.belongsTo(models.user, {
        onDelete: "CASCADE",
      });
    }
  }
  Event.init(
    {
      title: DataTypes.STRING,
      location: DataTypes.STRING,
      date: DataTypes.DATE,
      hour: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      participantsIds: DataTypes.ARRAY(DataTypes.STRING),
    },
    {
      sequelize,
      modelName: "event",
    }
  );
  return Event;
};
