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

    CategoryGroupOfCats.belongsTo(Category, { as: "cat", foreignKey: "catId"});
    Category.hasMany(CategoryGroupOfCats, { as: "categoryGroupOfCats", foreignKey: "catId"});
    Pomo.belongsTo(Category, { as: "cat", foreignKey: "catId"});
    Category.hasMany(Pomo, { as: "pomos", foreignKey: "catId"});
    CategoryGroupOfCats.belongsTo(GroupOfCats, { as: "gr", foreignKey: "grId"});
    GroupOfCats.hasMany(CategoryGroupOfCats, { as: "categoryGroupOfCats", foreignKey: "grId"});

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
