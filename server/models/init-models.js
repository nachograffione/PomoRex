var DataTypes = require("sequelize").DataTypes;
var _Category = require("./Category");
var _CategoryGroupOfCats = require("./CategoryGroupOfCats");
var _GroupOfCats = require("./GroupOfCats");
var _Pomo = require("./Pomo");

function initModels(sequelize) {
    var Category = _Category(sequelize, DataTypes);
    var CategoryGroupOfCats = _CategoryGroupOfCats(sequelize, DataTypes);
    var GroupOfCats = _GroupOfCats(sequelize, DataTypes);
    var Pomo = _Pomo(sequelize, DataTypes);

    Category.belongsToMany(GroupOfCats, { as: "groups", through: "categoryGroupOfCats", foreignKey: "grId" });
    GroupOfCats.belongsToMany(Category, { as: "categories", through: "categoryGroupOfCats", foreignKey: "catId" });
    Pomo.belongsTo(Category, { as: "category", foreignKey: "catId" });
    Category.hasMany(Pomo, { as: "pomos", foreignKey: "catId" });

    return {
        Category,
        CategoryGroupOfCats,
        GroupOfCats,
        Pomo,
    };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
