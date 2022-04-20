exports.getCategories = getCategories;
exports.insertPomo = insertPomo;
exports.getLastInsert = getLastInsert;
exports.editLastPomo = editLastPomo;
exports.getPomosQty = getPomosQty;

// Connect to db
const pgp = require('pg-promise')();
const db = pgp('postgres://postgres:nacho@localhost:5433/pomoRex');

function adaptPomoAttrNames(pomo) {
    pomo["id"] = pomo["pomid"];
    delete pomo["pomid"];
    pomo["date"] = pomo["pomdate"];
    delete pomo["pomdate"];
    pomo["idCategory"] = pomo["pomidcategory"];
    delete pomo["pomidcategory"];
    pomo["idSubcategory"] = pomo["pomidsubcategory"];
    delete pomo["pomidsubcategory"];
    return pomo;
}

async function getCategories() {
    let categories = [];

    // Leaves are subcategories (with their category) or categories without subcategories
    // They are ordered by their ids, and is important for the loop below
    const leaves = await db.any(
        "SELECT catid, catname, subcid, subcname FROM category, subcategory \
            WHERE subcidcategory = catid \
            UNION SELECT catid, catname, null, null FROM category \
                WHERE catid NOT IN (SELECT DISTINCT subcidcategory FROM subcategory) \
            ORDER BY catid, subcid");

    // It does the composition and adapts the names removing prefixes
    // WATCH OUT! This wierd loop only works if the query follows the ids order
    let i = 0;
    while (i < leaves.length) {
        // Make the category
        let category = {
            id: leaves[i].catid,
            name: leaves[i].catname,
            subcategories: []
        };
        // Fill with subcategories
        while (leaves[i].catid == category.id && leaves[i].subcid != null) {
            category.subcategories.push({
                id: leaves[i].subcid,
                name: leaves[i].subcname
            });
            i++;
        }
        categories.push(category);
        i++;
    };
    return categories;
}

function getCategoriesMock() {
    return [
        {
            id: 1,
            name: "Facultad",
            subcategories: [
                {
                    id: 1,
                    name: "Estudio",
                },
                {
                    id: 2,
                    name: "TPs, Otros",
                }
            ]
        },
        {
            id: 2,
            name: "Música",
            subcategories: [
                {
                    id: 3,
                    name: "Clases",
                },
                {
                    id: 4,
                    name: "Ejercitar, tocar, componer, etc.",
                }
            ]
        },
        {
            id: 3,
            name: "Ingenería",
            subcategories: [
                {
                    id: 5,
                    name: "Clases",
                },
                {
                    id: 6,
                    name: "Trabajo",
                }
            ]
        },
        {
            id: 4,
            name: "Otros",
            subcategories: []
        }
    ]
}

async function insertPomo(catId, subcId, date) {
    // date format: "yyyy/mm/dd"
    return await db.none("INSERT INTO pomo VALUES (DEFAULT, $1, $2, $3)", [date, catId, subcId]);
}

async function getLastInsert() {
    // It gets from db and adapts the names removing prefixes

    // by id, because you want the last inserted, that can has got an older date
    let pomo = await db.one("SELECT * FROM pomo ORDER BY pomid DESC LIMIT 1");
    adaptPomoAttrNames(pomo);

    // remove timestamp
    pomo.date = pomo.date.toISOString().slice(0, 10);;
    return pomo;
}

async function editLastPomo(catId, subcId, date) {
    // date format: "yyyy/mm/dd"
    return await db.none(
        "UPDATE pomo \
            SET pomidcategory = $1, pomidsubcategory = $2, pomdate = $3 \
            WHERE pomid = (SELECT pomid FROM pomo ORDER BY pomid DESC LIMIT 1)", [catId, subcId, date]);
}

async function getPomosQty(dateFrom, dateTo, categoryId, subcategoryId = undefined) {
    // The count parsing is because pg returns a bigint for columns with COUNT,
    // and it is converted to an unexpected string since is unsoported by node or pg-promise or idk which one
    if (subcategoryId != undefined) {
        return await db.any(
            "SELECT date_part('day', pomdate) AS day, COUNT(pomid)::INT AS qty FROM pomo \
            WHERE pomdate >= $1 AND pomdate <= $2 AND pomidcategory = $3 AND pomidsubcategory = $4 \
            GROUP BY date_part('day', pomdate)", [dateFrom, dateTo, categoryId, subcategoryId]);
    }
    else {
        return await db.any(
            "SELECT date_part('day', pomdate) AS day, COUNT(pomid)::INT AS qty FROM pomo \
            WHERE pomdate >= $1 AND pomdate <= $2 AND pomidcategory = $3 \
            GROUP BY date_part('day', pomdate)", [dateFrom, dateTo, categoryId]);
    }
}