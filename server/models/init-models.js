var DataTypes = require("sequelize").DataTypes;
var _CatGr = require("./CatGr");
var _Category = require("./Category");
var _GroupOfCats = require("./GroupOfCats");
var _Pomo = require("./Pomo");

function initModels(sequelize) {
  var CatGr = _CatGr(sequelize, DataTypes);
  var Category = _Category(sequelize, DataTypes);
  var GroupOfCats = _GroupOfCats(sequelize, DataTypes);
  var Pomo = _Pomo(sequelize, DataTypes);

  CatGr.belongsTo(Category, { as: "cat", foreignKey: "cat_id"});
  Category.hasMany(CatGr, { as: "cat_grs", foreignKey: "cat_id"});
  Pomo.belongsTo(Category, { as: "cat", foreignKey: "cat_id"});
  Category.hasMany(Pomo, { as: "pomos", foreignKey: "cat_id"});
  CatGr.belongsTo(GroupOfCats, { as: "gr", foreignKey: "gr_id"});
  GroupOfCats.hasMany(CatGr, { as: "cat_grs", foreignKey: "gr_id"});

  return {
    CatGr,
    Category,
    GroupOfCats,
    Pomo,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
