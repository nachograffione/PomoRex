// Show the starting view
//  nested categories items based on db

showCategories("checkbox", "categoryDiv");

setDateSelector();

// Manage checkbox selection

function checkboxSelectionHandler(evt) {
    // It toggles the subcategories of the category that was toggled
    const buttonState = evt.target.checked;
    const toggledCatId = getFromHTMLElementId(evt.target.getAttribute("id")).catId;
    for (const checkbox of document.querySelectorAll("input[type=checkbox]")) {
        if (getFromHTMLElementId(checkbox.getAttribute("id")).catId == toggledCatId) {
            checkbox.checked = buttonState;
        }
    }
}

async function addListenersToSubcatButtons() {
    categories = await fetchCategories();
    for (const category of categories) {
        if (category.subcategories.length != 0) {
            const button = document.querySelector("#" + makeHTMLElementId("checkbox", category.id, undefined));
            button.addEventListener("input", checkboxSelectionHandler);
        }
    }
}

addListenersToSubcatButtons();

// Calculate 10 worker days before average


// Update average chart


// Update 10 worker days before chart


// Update last inputs list


// Update month chart
function getActiveCategories() {
    return {
        categories: [
            {
                id: 3,
                name: "Ingenería",
                subcategories: [
                    {
                        id: 5,
                        name: "Clases",
                    }
                ]
            },
            {
                id: 4,
                name: "Otros",
                subcategories: []
            }
        ]
    };
}
async function fetchMonth(month, year) {
    const dataParsed = await axios.get("/api/getMonth", { params: { month: month, year: year, categories: getActiveCategories() } });
    return dataParsed.data;
}

function makeLabelsMonth(month, year) {
    let days = [];
    const lastDay = new Date(year, month, 0);
    for (let day = 1; day <= lastDay.getDate(); day++) {
        days.push(day);
    }
    return days;
}

function makePomosList(month, year, pomos) {
    let pomosOnDays = [];
    for (const day of makeLabelsMonth(month, year)) {
        let isZero = true;
        for (const pomo of pomos) {
            if (pomo.day == day) {
                pomosOnDays.push(pomo.qty);
                isZero = false;
                break;
            }
        }
        if (isZero) pomosOnDays.push(0);
    }
    return pomosOnDays;
}
async function makeDatasetsMonth(month, year) {
    const pomosMonth = await fetchMonth(month, year);   // It returns leaves
    let datasets = [];
    const colors = ["#a71116", "#c92329", "#eb353c", "#ef6066", "#f48c90", "#f8b7b9", "#fce2e3"];
    for (const item of pomosMonth) {
        let dataset = {};
        if (item.subcategory != undefined) {
            dataset.label = item.category.name + " - " + item.subcategory.name;
        }
        else {
            dataset.label = item.category.name;
        }
        dataset.data = makePomosList(month, year, item.pomos);
        dataset.stack = "SingleGroup";
        dataset.backgroundColor = colors[pomosMonth.indexOf(item)];
        datasets.push(dataset);
    }
    console.log(datasets);
    return datasets;
}

async function createMonthChart(month, year) {
    const data = {
        labels:
            makeLabelsMonth(month, year),
        // [1, 2, 3],
        datasets:
            await makeDatasetsMonth(month, year),
        // [
        //     {
        //         label: "fourish things",
        //         data: [4, 4, 4],
        //         stack: "SingleGroup",
        //         backgroundColor: "#1c3e35"
        //     },
        //     {
        //         label: "tenth things",
        //         data: [10, 10, 10],
        //         stack: "SingleGroup",
        //         backgroundColor: "#1c3eff"
        //     }
        // ],
        options: {
            scales: {
                x: {
                    stacked: true
                },
                y: {
                    stacked: true
                }
            }
        }
    };

    const myChart = new Chart(
        document.querySelector("#monthChartCanva"),
        {
            type: "bar",
            data: data
        }
    );
}

createMonthChart(4, 2022);
// Update charts after a user selection