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
        // It returns those pomos that match with the categories and are into the half-bounded date interval [dateFrom, dateTo)

        // since ALL is not a value but a reserved word, it needs to be added as plain text, it can't be added through sequelize replacements
        let query = "SELECT id, datetime, cat_id AS \"catId\" FROM pomo WHERE \
                        date(datetime) >= :dateFrom \
                        AND date(datetime) < :dateTo \
                        AND cat_id IN (:categories) \
                        ORDER BY datetime DESC \
                        LIMIT :lastAmount";

        let replacements = {};
        [replacements.categories, replacements.dateFrom, replacements.dateTo] = await this.setCommonParams(categories, dateFrom, dateTo);

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
        // Expected date format: "YYYY-MM-DD"
        // It returns a list of objects representing each day and their quantities by category,
        // including those pomos that match with the categories and are into the half-bounded date interval [dateFrom, dateTo)

        // Return format:
        // [
        //      {
        //          date: <date>,
        //          categories: [
        //              {
        //                  catId: <catId>,
        //                  quantity: <quantity>
        //              }
        //              ...
        //          ]
        //      }
        //      ...
        // ]

        let replacements = {};
        [replacements.categories, replacements.dateFrom, replacements.dateTo] = await this.setCommonParams(categories, dateFrom, dateTo);

        // get a list of quantities for each combination of date and category
        const queryResult = await this.sequelize.query(
            // The count parsing is because postgres returns a bigint for COUNT columns, which is not suported
            "SELECT date(datetime) AS \"date\", cat_id AS \"catId\", COUNT(id)::INT AS quantity FROM pomo WHERE \
                date(datetime) >= :dateFrom \
                AND date(datetime) < :dateTo \
                AND cat_id IN (:categories) \
                GROUP BY (date(datetime), cat_id) \
                ORDER BY date(datetime) DESC",
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
            if (lastDay == undefined || lastDay.date != dateCatQty.date) {
                // make a new empty date
                dates.push({
                    date: dateCatQty.date,
                    categories: []
                });
                // refresh lastDay
                lastDay = dates[dates.length - 1];
            }
            // either with an existing date or the recently created one
            lastDay.categories.push({
                catId: dateCatQty.catId,
                quantity: dateCatQty.quantity
            });
        }

        return dates;
    }

    async setCommonParams(categories = undefined, dateFrom = undefined, dateTo = undefined) {
        // set categories
        if (categories == undefined) {
            // get all the categories' id
            categories = await this.getCategories();
            categories = categories.map(category => category.id);
        }

        // set dateFrom as the earliest date by default
        if (dateFrom == undefined) {
            dateFrom = "-infinity"; // postgres uses this string value as the earliest date
        }

        // set dateTo as the next of the current date by default
        if (dateTo == undefined) {
            dateTo = new Date(); // the constructor returns current datetime by default
            dateTo.setDate(dateTo.getDate() + 1);
            dateTo = dateTo.toISOString();
            dateTo = dateTo.slice(0, dateTo.indexOf("T")); // remove time and timezone
        }

        return [categories, dateFrom, dateTo];
    }
}

exports.PomoRepository = PomoRepository;