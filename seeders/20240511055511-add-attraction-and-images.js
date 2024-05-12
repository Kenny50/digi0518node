'use strict';
const attractionsData = require('../data/khhattractions.json');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async (t) => {
            const rmImagesAttraction = attractionsData.map(obj => {
                const { images, opentimeGoogle, ...rest } = obj
                return { opentimeGoogle: opentimeGoogle.toString(), ...rest }
            })
            console.log("seed attraction")
            // Seed Attractions
            await queryInterface.bulkInsert('Attractions', rmImagesAttraction, { transaction: t });

            console.log("seed images")
            // Seed Images
            for (const attraction of attractionsData) {
                const attractionId = attraction.id;
                if (attraction.images.length > 0) {
                    const images = attraction.images.map(url => ({ url, sourceId: attractionId, sourceType: 'Attractions' }));
                    await queryInterface.bulkInsert('Images', images, { transaction: t });
                }
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async (t) => {
            // Delete Images
            await queryInterface.bulkDelete('Images', null, { transaction: t });

            // Delete Attractions
            await queryInterface.bulkDelete('Attractions', null, { transaction: t });
        });
    }
};
