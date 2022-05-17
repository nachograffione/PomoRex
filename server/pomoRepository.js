const { Sequelize, DataTypes, QueryTypes } = require("sequelize");
// command line used to generate models imported here:
// node_modules/.bin/sequelize-auto -o "./models" -d pomo_rex -h localhost -u postgres -p 5433 -x postgres -e postgres --caseFile p --caseModel p --caseProp l
const initModels = require("./models/init-models");

class PomoRepository {
    constructor() {
        // sequelize init
        this.sequelize = new Sequelize(
            "postgres://postgres:postgres@localhost:5433/pomo_rex",
            {
                timestamps: true,
                define: {
                    freezeTableName: true
                }
            }
        );
        // sequelize-auto init
        this.models = initModels(this.sequelize);
    }

    async getCategories(groups) {
        const results = await this.sequelize.query(
            "SELECT * FROM category WHERE \
                id IN (SELECT cat_id FROM cat_gr WHERE \
                        gr_id IN (:groups))",
            {
                replacements: {
                    groups: groups
                },
                type: QueryTypes.SELECT
            });
        return results;
    }
}

exports.PomoRepository = PomoRepository;