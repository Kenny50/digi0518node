'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../initDb');

class Summaries extends Model {
    static associate(models) {

    }
}
Summaries.init({
    en: DataTypes.TEXT,
    zh: DataTypes.TEXT,
    label: DataTypes.STRING
}, {
    sequelize,
    modelName: 'Summaries',
});

module.exports = Summaries;

