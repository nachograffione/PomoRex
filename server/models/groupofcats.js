const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('groupofcats', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(40),
      allowNull: false,
      unique: "ak_groupofcats"
    }
  }, {
    sequelize,
    tableName: 'groupofcats',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "ak_groupofcats",
        unique: true,
        fields: [
          { name: "name" },
        ]
      },
      {
        name: "pk_groupofcats",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
