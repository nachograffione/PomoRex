exports.getCategories = getCategories;
exports.insertPomo = insertPomo;
exports.getLastInsert = getLastInsert;
exports.editLastPomo = editLastPomo;
exports.getMonth = getMonth;

// Connect to db
const pgp = require('pg-promise')();
const db = pgp('postgres://postgres:nacho@localhost:5433/pomoRex');

function adaptCategoryAttrNames(category) {
    category["id"] = category["catid"];
    delete category["catid"];
    category["name"] = category["catname"];
    delete category["catname"];
    for (let subcategory of category.subcategories) {
        subcategory["id"] = subcategory["subcid"];
        delete subcategory["subcid"];
        subcategory["name"] = subcategory["subcname"];
        delete subcategory["subcname"];
    }
    return category;
}

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
    // It does the composition and adapts the names removing prefixes
    let categories = await db.any("SELECT * FROM category");
    for (let category of categories) {
        category.subcategories = await db.any("SELECT * FROM subcategory WHERE subcIdCategory = $1", [category.catid]);
        adaptCategoryAttrNames(category);
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

async function getMonth(month) {
    // The count parsing is because pg returns a bigint for columns with COUNT, and it is converted to an unexpected string since is unsoported by node or pg-promise or idk which one
    return await db.any(
        "SELECT date_part('day', pomdate) AS day, COUNT(pomid)::INT AS qty FROM pomo \
            WHERE date_part('month', pomdate) = $1 GROUP BY date_part('day', pomdate)", [month]);
}