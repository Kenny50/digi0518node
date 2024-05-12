'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class add - order -
    for -attraction - in - itinerary extends Model {
      /**
       * Helper method for defining associations.
       * This method is not a part of Sequelize lifecycle.
       * The `models/index` file will call this method automatically.
       */
      static associate(models) {
        // define association here
      }
    }
  add - order -
    for -attraction - in - itinerary.init({
      order: DataTypes.STRING
    }, {
      sequelize,
      modelName: 'add-order-for-attraction-in-itinerary',
    });
  return add - order -
    for -attraction - in - itinerary;
};