exports.PomoRepository = PomoRepository;

// sequelize init
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize(
    "postgres://postgres:nacho@localhost:5433/pomoRex",
    {
        timestamps: true,
        define: {
            freezeTableName: true
        }
    }
);
// sequelize-auto init
const initModels = require("./models/init-models");
const models = initModels(sequelize);


class PomoRepository {
    constructor() {

    }
}
