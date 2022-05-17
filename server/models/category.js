const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Category', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(40),
      allowNull: false,
      unique: "ak_category"
    }
  }, {
    sequelize,
    tableName: 'category',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "ak_category",
        unique: true,
        fields: [
          { name: "name" },
        ]
      },
      {
        name: "pk_category",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
