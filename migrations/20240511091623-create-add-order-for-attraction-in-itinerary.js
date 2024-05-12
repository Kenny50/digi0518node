'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('AttractionInItinerary', 'order', {
            type: Sequelize.INTEGER,
            allowNull: false
        });
    },
    async down(queryInterface, Sequelize) {
        //since itinerary require certain order, no need to remove it when down
    }
};