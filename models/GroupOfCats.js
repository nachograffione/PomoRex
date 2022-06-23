const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('GroupOfCats', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(40),
            allowNull: false,
            unique: "ak_group_of_cats"
        }
    }, {
        sequelize,
        tableName: 'group_of_cats',
        schema: 'public',
        timestamps: false,
        indexes: [
            {
                name: "ak_group_of_cats",
                unique: true,
                fields: [
                    { name: "name" },
                ]
            },
            {
                name: "pk_group_of_cats",
                unique: true,
                fields: [
                    { name: "id" },
                ]
            },
        ]
    });
};
