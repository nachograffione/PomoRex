const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pomo', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    datetime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    catid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'category',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'pomo',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "index_fk_pomo_category",
        fields: [
          { name: "catid" },
        ]
      },
      {
        name: "pk_pomo",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
