'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../initDb');

class Attractions extends Model {
    static associate(models) {
        Attractions.hasMany(models.AttractionInItinerary)
        Attractions.belongsToMany(models.Itineraries, {
            through: models.AttractionInItinerary,
            foreignKey: 'attractionId',
        });
    }
}
Attractions.init({
    name: DataTypes.STRING,
    latlng: DataTypes.STRING,
    opentimeGoogle: DataTypes.STRING,
    googleScore: DataTypes.STRING,
    url: DataTypes.STRING,
    cover: DataTypes.STRING,
    type: DataTypes.STRING,
    description: DataTypes.TEXT
}, {
    sequelize,
    modelName: 'Attractions',
});

module.exports = Attractions;

