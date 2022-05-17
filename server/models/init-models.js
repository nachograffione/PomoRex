var DataTypes = require("sequelize").DataTypes;
var _category = require("./category");
var _catgr = require("./catgr");
var _groupofcats = require("./groupofcats");
var _pomo = require("./pomo");

function initModels(sequelize) {
  var category = _category(sequelize, DataTypes);
  var catgr = _catgr(sequelize, DataTypes);
  var groupofcats = _groupofcats(sequelize, DataTypes);
  var pomo = _pomo(sequelize, DataTypes);

  catgr.belongsTo(category, { as: "cat", foreignKey: "catid"});
  category.hasMany(catgr, { as: "catgrs", foreignKey: "catid"});
  pomo.belongsTo(category, { as: "cat", foreignKey: "catid"});
  category.hasMany(pomo, { as: "pomos", foreignKey: "catid"});
  catgr.belongsTo(groupofcats, { as: "gr", foreignKey: "grid"});
  groupofcats.hasMany(catgr, { as: "catgrs", foreignKey: "grid"});

  return {
    category,
    catgr,
    groupofcats,
    pomo,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
