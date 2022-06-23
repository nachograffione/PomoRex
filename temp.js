const colors = [
    //gradients from darker to brigher
    // green
    ["#1c3e35", "#315c4f", "#467a69", "#5b9883", "#6fb69d", "#84d4b7", "#99f2d1"],
    // blue
    ["#113873", "#174a97", "#1c5bba", "#266ed9", "#4584e3", "#689be8", "#8cb3ee"],
    // purple
    ["#22052d", "#3e2248", "#5b3f64", "#775c7f", "#93799a", "#b096b6", "#ccb3d1"],
    // yellow
    ["#ffd633", "#ffda47", "#ffde5c", "#ffe270", "#ffe785", "#ffea97", "#ffefad"],
    // red
    ["#a71116", "#c92329", "#eb353c", "#ef6066", "#f48c90", "#f8b7b9", "#fce2e3"],
    // "bluish" green
    ["#099773", "#139c78", "#1ca17d", "#26a783", "#30ac88", "#39b18d", "#43b692"],
    // salmony
    ["#f89563", "#f79764", "#f99e6f", "#faad83", "#fab58c", "#fcbe97", "#fbc3a2"]
]




async function getCategories() {
    let categories = [];

    // Leaves are subcategories (with their category) or categories without subcategories
    // leaves important format:
    //      it contains objects with pairs category-subcategory (id and name for each one)
    //      they are ordered by their ids
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
        // category
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



<div>
    <div>
        <canvas id="averageChartCanvas"></canvas>
    </div>
    <ul id="lastInputsUl">
    </ul>
    <div>
        <canvas id="daysBeforeChartCanvas"></canvas>
    </div>
    <div>
        <canvas id="monthChartCanvas"></canvas>
    </div>
</div>

function makeDatasetsDaysBefore() {
    let datasets = [];
    for (let i = 0; i < categories.length; i++) {
        for (let j = 1; j < categories[i].length; j++) {
            const category = categories[i][0];
            const subcat = categories[i][j];
            let dataset = {};
            dataset.label = category + " - " + subcat;
            dataset.data = daysBefore.values[i][j - 1];
            dataset.stack = "SingleGroup";
            dataset.backgroundColor = colors[i][j - 1];
            datasets.push(dataset);
        }
    }
    return datasets;
}

function createDaysBeforeChart() {

    const data = {
        labels: daysBefore.days,
        datasets: makeDatasetsDaysBefore(),
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
        document.querySelector("#daysBeforeChartCanvas"),
        {
            type: "bar",
            data: data
        }
    );
}

createDaysBeforeChart();












const monthChartCanva = document.querySelector("#monthChartCanva");
const monthChart = new Chart(monthChartCanva, {
    type: 'bar',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

