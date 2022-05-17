const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('catgr', {
    catid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'category',
        key: 'id'
      }
    },
    grid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'groupofcats',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'catgr',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "index_fk_catgr_category",
        fields: [
          { name: "catid" },
        ]
      },
      {
        name: "index_fk_catgr_groupofcats",
        fields: [
          { name: "grid" },
        ]
      },
    ]
  });
};
