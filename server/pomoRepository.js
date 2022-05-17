// sequelize init
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize(
    "postgres://postgres:postgres@localhost:5433/pomo_rex",
    {
        timestamps: true,
        define: {
            freezeTableName: true
        }
    }
);
// sequelize-auto init
//      command line used to generate models: node_modules/.bin/sequelize-auto -o "./models" -d pomo_rex -h localhost -u postgres -p 5433 -x postgres -e postgres --caseFile p --caseModel p --caseProp l
const initModels = require("./models/init-models");
const models = initModels(sequelize);


class PomoRepository {
    constructor() {

    }
}

exports.PomoRepository = PomoRepository;