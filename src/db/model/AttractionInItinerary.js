'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../initDb');

class AttractionInItinerary extends Model {
    static associate(models) {
        AttractionInItinerary.belongsTo(models.Itineraries, { foreignKey: 'itineraryId' });
        AttractionInItinerary.belongsTo(models.Attractions, { foreignKey: 'attractionId' });
    }
}
AttractionInItinerary.init({
    itineraryId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Itineraries',
            key: 'id'
        }
    },
    attractionId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Attractions',
            key: 'id'
        }
    }
}, {
    sequelize,
    modelName: 'AttractionInItinerary',
    tableName: 'AttractionInItinerary',
});

module.exports = AttractionInItinerary;
