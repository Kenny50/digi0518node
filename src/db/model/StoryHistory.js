'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../initDb');

class StoryHistory extends Model {
    static associate(models) {
        StoryHistory.hasMany(models.Attractions)
    }
}
StoryHistory.init({
    session: DataTypes.UUID,
    itineraryId: DataTypes.INTEGER,
    step: DataTypes.INTEGER,
    story: DataTypes.STRING
}, {
    sequelize,
    modelName: 'StoryHistory',
    tableName: 'StoryHistory'
});
module.exports = StoryHistory;
