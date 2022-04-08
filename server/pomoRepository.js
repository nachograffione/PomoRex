exports.getCategories = getCategories;

// Connect to db
const pgp = require('pg-promise')();
const db = pgp('postgres://postgres:nacho@localhost:5433/pomoRex');

function adaptAttrNames(category) {
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

async function getCategories() {
    // It does the composition and adapts the names removing prefixes
    let categories = await db.any("SELECT * FROM category");
    for (let category of categories) {
        category.subcategories = await db.any("SELECT * FROM subcategory WHERE subcIdCategory = $1", [category.catid]);
        adaptAttrNames(category);
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