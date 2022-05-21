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

  CatGr.belongsTo(Category, { as: "cat", foreignKey: "catId"});
  Category.hasMany(CatGr, { as: "catGrs", foreignKey: "catId"});
  Pomo.belongsTo(Category, { as: "cat", foreignKey: "catId"});
  Category.hasMany(Pomo, { as: "pomos", foreignKey: "catId"});
  CatGr.belongsTo(GroupOfCats, { as: "gr", foreignKey: "grId"});
  GroupOfCats.hasMany(CatGr, { as: "catGrs", foreignKey: "grId"});

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
