'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Attractions', 'task', {
            type: Sequelize.TEXT,
            allowNull: true,
        });
        await queryInterface.addColumn('Attractions', 'enTask', {
            type: Sequelize.TEXT,
            allowNull: true,
        });
        await queryInterface.addColumn('Attractions', 'hint', {
            type: Sequelize.TEXT,
            allowNull: true,
        });
        await queryInterface.addColumn('Attractions', 'enHint', {
            type: Sequelize.TEXT,
            allowNull: true,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Attractions', 'enHint');
        await queryInterface.removeColumn('Attractions', 'hint');
        await queryInterface.removeColumn('Attractions', 'enTask');
        await queryInterface.removeColumn('Attractions', 'task');
    }
};
