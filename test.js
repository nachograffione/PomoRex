const { PomoRepository } = require("./pomoRepository");

async function f() {
    const pr = new PomoRepository();
    // const varToLogOut = await pr.getCategories();
    const varToLogOut = await pr.getCategory(4);
    // await pr.deleteGroup(32);
    // const r = await pr.insertGroup("Clases", [3, 5]);
    // const varToLogOut = await pr.updateGroup(r.id, "Grupin random", [1, 2]);
    console.log(varToLogOut);
    // console.log(await varToLogOut[0].getCategories());

};

f();