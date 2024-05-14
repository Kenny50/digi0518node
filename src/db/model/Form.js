'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../initDb');

class Forms extends Model {
    static associate(models) {
        Forms.belongsTo(models.Itineraries, { foreignKey: 'itineraryId' });
    }
}
Forms.init({
    trafficRate: DataTypes.FLOAT,
    text: DataTypes.TEXT,
    itineraryRate: DataTypes.FLOAT,
    attractionRate: DataTypes.FLOAT,
    itineraryId: DataTypes.INTEGER
}, {
    sequelize,
    modelName: 'Forms',
});

module.exports = Forms;

