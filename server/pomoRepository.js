const { Sequelize, DataTypes, QueryTypes } = require("sequelize");
// command line used to generate models imported here:
// node_modules/.bin/sequelize-auto -o "./models" -d pomo_rex -h localhost -u postgres -p 5433 -x postgres -e postgres --caseFile p --caseModel p --caseProp c
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
                },
                // for timezone working
                dialect: 'postgres',
                dialectOptions: { // for reading
                    useUTC: false,
                    timezone: '-03:00',
                },
                timezone: '-03:00', // for writing
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

    async getPomos(categories = undefined, dateFrom = undefined, dateTo = undefined, lastAmount = undefined) {
        // Expected date format: "YYYY-MM-DD"
        // Date interval: [dateFrom, dateTo)
        //      Thinking that a date starts at 00:00:00.000

        // since ALL is not a value but a reserved word, it needs to be added as plain text, it can't be added through sequelize replacements
        let query = "SELECT id, datetime, cat_id AS \"catId\" FROM pomo WHERE \
                        datetime >= :datetimeFrom \
                        AND datetime < :datetimeTo \
                        AND cat_id IN (:categories) \
                        ORDER BY datetime DESC \
                        LIMIT :lastAmount";

        let replacements = {};
        [replacements.categories, replacements.datetimeFrom, replacements.datetimeTo] = await this.setCommonParams(categories, dateFrom, dateTo);

        // set lastAmount as ALL or the given int
        if (lastAmount == undefined) {
            query = query.replace(":lastAmount", "ALL");
        }
        else {
            replacements.lastAmount = lastAmount;
        }

        return await this.sequelize.query(
            query,
            {
                replacements: replacements,
                type: QueryTypes.SELECT
            }
        );
    }

    async getPomo(id) {
        return await this.sequelize.query(
            "SELECT id, datetime, cat_id AS \"catId\" FROM pomo WHERE \
                id = :id",
            {
                replacements: {
                    id: id
                },
                type: QueryTypes.SELECT
            }
        );
    }

    async getPomosQuantities(categories = undefined, dateFrom = undefined, dateTo = undefined) {
        // Return format:
        // [
        //      {
        //          date: <date>,
        //          categories: [
        //              {
        //                  cat_id: <cat_id>,
        //                  quantity: <quantity>
        //              }
        //              ...
        //          ]
        //      }
        //      ...
        // ]

        let replacements = {};
        [replacements.categories, replacements.datetimeFrom, replacements.datetimeTo] = await this.setCommonParams(categories, dateFrom, dateTo);

        // get a list of quantities for each combination of date and category
        const queryResult = await this.sequelize.query(
            // The count parsing is because postgres returns a bigint for COUNT columns, which is not suported
            "SELECT date(datetime) AS \"dateOnly\", cat_id AS \"catId\", COUNT(id)::INT AS quantity FROM pomo WHERE \
                datetime >= :datetimeFrom \
                AND datetime < :datetimeTo \
                AND cat_id IN (:categories) \
                GROUP BY (\"dateOnly\", cat_id) \
                ORDER BY \"dateOnly\" DESC",
            {
                replacements: replacements,
                type: QueryTypes.SELECT
            }
        );

        // keep in mind that queryResult is ordered by date
        let dates = [];
        for (const dateCatQty of queryResult) {
            let lastDay = dates[dates.length - 1]; // be careful with references values things
            // if the last date doesn't exist or is different from the current item
            if (lastDay == undefined || lastDay.date_only != dateCatQty.date_only) {
                // make a new empty date and refresh lastDay
                dates.push({
                    date: dateCatQty.date_only,
                    categories: []
                });
                lastDay = dates[dates.length - 1];
            }
            // either with an existing date or the recently created one
            lastDay.categories.push({
                cat_id: dateCatQty.cat_id,
                quantity: dateCatQty.quantity
            });
        }

        return { dates: dates };
    }

    async setCommonParams(categories = undefined, dateFrom = undefined, dateTo = undefined) {
        // set categories
        if (categories == undefined) {
            // get all the categories' id
            categories = await this.getCategories();
            categories = categories.map(category => category.id);
        }

        // set datetimeFrom as -infinity or the given date and 00:00:00.000 as time
        let datetimeFrom;
        if (dateFrom == undefined) {
            datetimeFrom = "-infinity"; // postgre uses this string value as the earliest date
        }
        else {
            datetimeFrom = new Date(dateFrom); // the constructor adds 00:00.000 as time
        }

        // set datetimeTo as the current datetime or the given date and 00:00:00.000 as time
        let datetimeTo;
        if (dateTo == undefined) {
            datetimeTo = new Date(); // it returns current datetime by default
        }
        else {
            datetimeTo = new Date(dateTo); // the constructor adds 00:00.000 as time
        }

        return [categories, datetimeFrom, datetimeTo];
    }
}

exports.PomoRepository = PomoRepository;