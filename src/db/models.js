const sequelize = require('./initDb.js')

const StoryHistory = require('../db/model/StoryHistory.js');
const Itineraries = require('../db/model/Itineraries.js');
const Attractions = require('../db/model/Attractions.js');
const AttractionInItinerary = require('../db/model/AttractionInItinerary.js');

Itineraries.associate(sequelize.models)
Attractions.associate(sequelize.models)
AttractionInItinerary.associate(sequelize.models)

module.exports = {
    StoryHistory,
    Itineraries,
    Attractions,
    AttractionInItinerary
}