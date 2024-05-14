'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        let transaction;
        try {
            transaction = await queryInterface.sequelize.transaction();

            // Add the 'title' column
            await queryInterface.addColumn('Itineraries', 'title', {
                type: Sequelize.TEXT,
                allowNull: false
            }, { transaction });

            // Add the 'cover' column
            await queryInterface.addColumn('Itineraries', 'cover', {
                type: Sequelize.TEXT,
                allowNull: true // Modify allowNull based on your requirements
            }, { transaction });

            // Commit the transaction
            await transaction.commit();
        } catch (error) {
            // If an error occurs, rollback the transaction
            if (transaction) await transaction.rollback();
            throw error;
        }
    },

    async down(queryInterface, Sequelize) {
        let transaction;
        try {
            transaction = await queryInterface.sequelize.transaction();

            // Remove the 'title' column
            await queryInterface.removeColumn('Itineraries', 'title', { transaction });

            // Remove the 'cover' column
            await queryInterface.removeColumn('Itineraries', 'cover', { transaction });

            // Commit the transaction
            await transaction.commit();
        } catch (error) {
            // If an error occurs, rollback the transaction
            if (transaction) await transaction.rollback();
            throw error;
        }
    }
};
