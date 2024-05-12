'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../initDb');

class Images extends Model {
    static associate(models) {
        // Define associations if any
    }
}
Images.init({
    url: DataTypes.STRING,
    sourceId: DataTypes.INTEGER,
    sourceType: DataTypes.STRING
}, {
    sequelize,
    modelName: 'Images',
});
module.exports = Images;