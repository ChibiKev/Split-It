'use strict'

module.exports = (Sequelize, DataTypes) => {
    const Transaction = sequelize.define("Transaction", {
        transactionID: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            autoIncrement: true
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        total: {
            // int with 2 decimal places
            type: DataTypes.DECIMAL(10,2),
            allowNull: false
        },
        totalPaid: {
            type: DataTypes.BOOLEAN,
            allowNull:false
        }
    })

    Transaction.associate = function(models) {
        Transaction.belongsTo(models.User, {
            as: 'createdBy',
            foreignKey: 'userID'
        });
    };

    return Transaction;
}