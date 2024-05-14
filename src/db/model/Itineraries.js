'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../initDb');

class Itineraries extends Model {
    static associate(models) {
        Itineraries.hasMany(models.AttractionInItinerary)
        Itineraries.belongsToMany(models.Attractions, {
            through: models.AttractionInItinerary,
            foreignKey: 'itineraryId',
        });
    }
}
Itineraries.init({
    description: DataTypes.TEXT,
    cover: DataTypes.TEXT,
    title: DataTypes.TEXT
}, {
    sequelize,
    modelName: 'Itineraries',
});

module.exports = Itineraries;

