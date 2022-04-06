function getCategories() {

    return // a list of categories objects, which has got a list of subcategories
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