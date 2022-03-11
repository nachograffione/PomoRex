/////////////////////////////////////HARDCODED DATABASE FOR DEVELOPMENT PURPOSE
/////////////////Categories
//lisp notation
//it's a tree (therefore the first element is a list with the root node)
//each node is either a str (if is has no children) or an array (if it's a parent)
const categories = [
    ["All categories",
        ["Facultad",
            "Estudio",
            "Clases",
            "Organización",
            "TPs, Otros"],
        ["Ingeniería",
            "Planificar",
            "Clases",
            "Programar, estudiar prog, etc.",
            "Trabajo"],
        ["Música",
            "Planificar",
            "Clases",
            "Ejercitar, tocar, componer, etc."],
        "Ejercicio",
        "Otro"
    ]
];


class CategoryNode {
    constructor(name, parent = null, childrenArray = []) {
        this.name = name;
        this.parent = parent;
        this.childrenArray = childrenArray;
        if (!parent) {
            this.id = "0";
        }
    }

    isRoot() {
        return !this.parent;
    }

    isLeaf() {
        return this.childrenArray.length == 0;
    }
}

class CategoriesTree {
    constructor(rootNode) {
        this.rootNode = rootNode;
    }

    appendChild(childNode, parentId) {

    }

    getLeaves() {

    }
}

function makeCategoriesTree(lispTree) {

    //HTML TREE CREATOR, FOR REUSE STRUCTURE

    // //create the array div
    // const arrayDiv = document.createElement("div");
    // //for each item
    // for (let i = 0; i < array.length; i++) {
    //     const item = array[i];

    //     const itemId = String(firstButtonId) + "." + String(i);
    //     let itemDiv;
    //     //if it's an array
    //     if (Array.isArray(item)) {
    //         //create a item div
    //         itemDiv = document.createElement("div");
    //         //add the first element to the item div
    //         const button = createHTMLOfCategoryButton(buttonType, item[0], itemId);
    //         itemDiv.appendChild(button);

    //         //add childArray to the item div
    //         const childArrayDiv = createHTMLOfCategoriesArray(buttonType, item.slice(1), itemId); //childArray = recursive call with slice
    //         itemDiv.appendChild(childArrayDiv);
    //     }
    //     else {
    //         itemDiv = createHTMLOfCategoryButton(buttonType, array[i], itemId);
    //     }
    //     //add the item div into the main div
    //     arrayDiv.appendChild(itemDiv);
    // }
    // return arrayDiv;
}

makeCategoriesTree();