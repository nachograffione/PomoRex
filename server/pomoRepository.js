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

    async getGroups() {
        return await this.sequelize.query(
            "SELECT * FROM group_of_cats",
            {
                type: QueryTypes.SELECT
            }
        );
    }

    async getCategories(groups = undefined) {
        // groups is a list of ids

        let query = "SELECT * FROM category WHERE \
                        id IN (SELECT cat_id FROM cat_gr WHERE \
                                    gr_id IN (:groups))";
        let replacements = {};

        // include all groups keeps out the ungrouped categories, so to include all of them i have to remove the condition
        if (groups == undefined) {
            query = query.slice(0, query.indexOf("WHERE")); // it keeps from the begining to the first WHERE
        }
        else {
            replacements.groups = groups;
        }

        return await this.sequelize.query(
            query,
            {
                replacements: replacements,
                type: QueryTypes.SELECT
            }
        );
    }

    async getCategory(id) {
        return await this.sequelize.query(
            "SELECT * FROM category WHERE \
                id = :id",
            {
                replacements: {
                    id: id
                },
                type: QueryTypes.SELECT
            }
        );
    }
}

exports.PomoRepository = PomoRepository;