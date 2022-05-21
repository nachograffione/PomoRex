const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('CatGr', {
    catId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'category',
        key: 'id'
      },
      field: 'cat_id'
    },
    grId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'group_of_cats',
        key: 'id'
      },
      field: 'gr_id'
    }
  }, {
    sequelize,
    tableName: 'cat_gr',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "index_fk_cat_gr_category",
        fields: [
          { name: "cat_id" },
        ]
      },
      {
        name: "index_fk_cat_gr_group_of_cats",
        fields: [
          { name: "gr_id" },
        ]
      },
    ]
  });
};
