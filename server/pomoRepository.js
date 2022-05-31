const { Sequelize, DataTypes, QueryTypes } = require("sequelize");
const initModels = require("./models/init-models");

// To generate models:
//  Run this command from the terminal:
//      node_modules/.bin/sequelize-auto -o "./models" -d pomo_rex -h localhost -u postgres -p 5433 -x postgres -e postgres --indentation 4 --caseFile p --caseModel p --caseProp c
//  Paste this in recently created init-models to fix the associations:
//      Category.belongsToMany(GroupOfCats, { as: "groups", through: CategoryGroupOfCats, foreignKey: "catId" });   // foreignKey is for the source model
//      GroupOfCats.belongsToMany(Category, { as: "categories", through: CategoryGroupOfCats, foreignKey: "grId" });    // foreignKey is for the source model
//      Pomo.belongsTo(Category, { as: "category", foreignKey: "catId" });
//      Category.hasMany(Pomo, { as: "pomos", foreignKey: "catId" });


class PomoRepository {
    constructor() {
        // sequelize init
        this.sequelize = new Sequelize(
            "postgres://postgres:postgres@localhost:5433/pomo_rex",
            {
                timestamps: false,
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
        let groups = await this.sequelize.query(
            "SELECT * FROM group_of_cats",
            {
                type: QueryTypes.SELECT
            });
        // Add category ids
        for (const group of groups) {
            group.categories = await this.getCategoriesIdsOfGroup(group.id);
        }
        return groups;
    }

    async getGroup(id) {
        let group = (await this.sequelize.query(
            "SELECT * FROM group_of_cats WHERE \
                id = :id",
            {
                replacements: {
                    id: id
                },
                type: QueryTypes.SELECT
            }
        ))[0];
        // Add category ids
        group.categories = await this.getCategoriesIdsOfGroup(group.id);
        return group;
    }

    async getCategoriesIdsOfGroup(groupId) {
        return (await this.sequelize.query(
            "SELECT cat_id AS \"catId\" FROM category_group_of_cats \
                WHERE gr_id = :groupId",
            {
                replacements: {
                    groupId: groupId
                },
                type: QueryTypes.SELECT
            })).map(category => category.catId);
    }

    async getCategories(groups = undefined) {
        // groups is a list of ids

        let query = "SELECT * FROM category WHERE \
                        id IN (SELECT cat_id FROM category_group_of_cats WHERE \
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
        return (await this.sequelize.query(
            "SELECT * FROM category WHERE \
                id = :id",
            {
                replacements: {
                    id: id
                },
                type: QueryTypes.SELECT
            }
        ))[0];
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
        return (await this.sequelize.query(
            "SELECT id, datetime, cat_id AS \"catId\" FROM pomo WHERE \
                id = :id",
            {
                replacements: {
                    id: id
                },
                type: QueryTypes.SELECT
            }
        ))[0];
    }

    async getPomosQuantities(categories = undefined, dateFrom = undefined, dateTo = undefined) {
        // Expected date format: "YYYY-MM-DD"
        // It returns a list of objects representing each day and their quantities by category,
        // including those pomos that match with the categories and are into the half-bounded date interval [dateFrom, dateTo)

        // Return format:
        // [
        //      {
        //          date: <date>,
        //          catsAndQties: [
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
            "SELECT date(generate_series) AS \"date\", cat_id AS \"catId\", COUNT(id)::INT AS quantity \
                FROM pomo RIGHT JOIN generate_series(:dateFrom::TIMESTAMP WITH TIME ZONE, :dateTo, '1 day') \
                    ON date(datetime) = date(generate_series) \
                WHERE (cat_id IN (:categories) \
                        OR cat_id IS NULL) \
                GROUP BY (date(generate_series), cat_id) \
                ORDER BY date(generate_series) DESC",
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
                    catsAndQties: []
                });
                // refresh lastDay
                lastDay = dates[dates.length - 1];
            }
            // if there's no pomos for this day, keep categories array empty
            if (dateCatQty.catId != null) {
                lastDay.catsAndQties.push({
                    catId: dateCatQty.catId,
                    quantity: dateCatQty.quantity
                });
            }
        }

        return dates;
    }

    async getPomosAverages(categories = undefined, dateFrom = undefined, dateTo = undefined) {
        // Expected date format: "YYYY-MM-DD"
        // It returns a list of objects with the average for each category (dividing by week days)
        // including those pomos that match with the categories and are into the half-bounded date interval [dateFrom, dateTo)

        // Return format:
        // [
        //      {
        //          catId: <catId>,
        //          average: <average>
        //      }
        //      ...
        // ]

        let replacements = {};
        [replacements.categories, replacements.dateFrom, replacements.dateTo] = await this.setCommonParams(categories, dateFrom, dateTo);

        return await this.sequelize.query(
            // The count parsing is because postgres returns a bigint for COUNT columns, which is not suported
            // I can't use AVG() because i need to count pomos for every day but divide only by weekdays,
            // so i have to count them separately and divide manually
            "SELECT category.id AS \"catId\", COUNT(pomos.id)::INT/(SELECT COUNT(generate_series)::INT \
                                                            FROM generate_series(:dateFrom::TIMESTAMP WITH TIME ZONE, :dateTo, '1 day') \
                                                            WHERE EXTRACT(isodow FROM generate_series) NOT IN(6, 7))::REAL AS average \
                FROM category LEFT JOIN(SELECT * FROM pomo \
                                            WHERE date(datetime) >= :dateFrom \
                                            AND date(datetime) < :dateTo) AS pomos \
                    ON cat_id = category.id \
                WHERE category.id IN(:categories) \
                GROUP BY category.id \
                ORDER BY category.id",
            {
                replacements: replacements,
                type: QueryTypes.SELECT
            }
        );
    }

    async setCommonParams(categories = undefined, dateFrom = undefined, dateTo = undefined) {
        // set categories
        if (categories == undefined) {
            // get all the categories' id
            categories = await this.getCategories();
            categories = categories.map(category => category.id);
        }

        // set dateFrom as the earliest date inserted by default
        if (dateFrom == undefined) {
            const queryResult = await this.sequelize.query(
                "SELECT MIN(date(datetime)) AS \"date\" FROM pomo",
                {
                    type: QueryTypes.SELECT
                }
            );
            dateFrom = queryResult[0].date;
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

    async insertCategory(name) {
        // build and persist the new Category
        return await this.models.Category.create({ name: name });
    }

    async insertPomo(datetime, catId) {
        // build and persist the new Pomo
        return await this.models.Pomo.create({ datetime: datetime, catId: catId });;
    }

    async updateCategory(id, newName) {
        let category = undefined;
        if (newName != undefined) {
            category = await this.models.Category.findByPk(id);
            category.name = newName;
            await category.save();
        }
        return category;
    }

    async updatePomo(id, newDatetime, newCatId) {
        let pomo = undefined;
        if (newDatetime != undefined || newCatId != undefined) {
            pomo = await this.models.Pomo.findByPk(id);
            if (newDatetime != undefined) pomo.datetime = newDatetime;
            if (newCatId != undefined) pomo.catId = newCatId;
            await pomo.save();
        }
        return pomo;
    }

    async deleteCategory(id) {
        const category = await this.models.Category.findByPk(id);
        await category.destroy();
        return category;
    }

    async deletePomo(id) {
        const pomo = await this.models.Pomo.findByPk(id);
        await pomo.destroy();
        return pomo;
    }
}

exports.PomoRepository = PomoRepository;