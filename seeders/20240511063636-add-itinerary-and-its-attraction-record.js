'use strict';
const itineraries = require('../data/allMrtItineraryDetail.json')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async (t) => {
            const itinerariesData = itineraries.map(itinerary => {
                const { attractions, ...rest } = itinerary
                return rest
            })
            await queryInterface.bulkInsert('Itineraries', itinerariesData, { transaction: t });

            const attractionsInIninerary = itineraries.flatMap(itinerary => {
                return itinerary.attractions.map((attractionId,index) => ({
                    itineraryId: itinerary.id,
                    attractionId: attractionId,
                    order: index
                }));
            });
            await queryInterface.bulkInsert('AttractionInItinerary', attractionsInIninerary, { transaction: t });

        })
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('AttractionInItinerary', null, {});
        await queryInterface.bulkDelete('Itineraries', null, {});
    }
};
