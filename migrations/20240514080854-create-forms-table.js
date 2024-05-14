'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Forms', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            trafficRate: {
                type: Sequelize.FLOAT
            },
            text: {
                type: Sequelize.TEXT
            },
            en: {
                type: Sequelize.TEXT
            },
            itineraryRate: {
                type: Sequelize.FLOAT
            },
            attractionRate: {
                type: Sequelize.FLOAT
            },
            itineraryId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Itineraries',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Forms');
    }
};
