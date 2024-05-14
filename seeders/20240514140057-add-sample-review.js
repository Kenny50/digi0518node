'use strict';
const attractionsData = require('../data/review.json');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Insert attraction data into Forms table
        await queryInterface.bulkInsert('Forms', attractionsData, {});
    },

    async down(queryInterface, Sequelize) {
        // Delete all data from Forms table
        await queryInterface.bulkDelete('Forms', null, {});
    }
};
