exports.getCategories = getCategories;

// Connect to db
const pgp = require('pg-promise')();
const db = pgp('postgres://postgres:nacho@localhost:5433/pomoRex');

async function getCategories() {
    // It returns a list of category objects, which has got a list of subcategories
    //     Remember to call with await, instead you will recieve a pending promise
    let categories = await db.any("SELECT * FROM category");
    for (let category of categories) {
        category.subcategories = await db.any("SELECT * FROM subcategory WHERE subcIdCategory = $1", [category.catid]);
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
            id: 2,
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
            id: 3,
            name: "Otros",
            subcategories: []
        }
    ]
}