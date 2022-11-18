const fs = require("fs");

var db = JSON.parse(fs.readFileSync("./data/db.json", "UTF-8"));

function addToList(content) {
  var id = Math.floor(Math.random() * 1000) + Date.now();

  db.lists.push({
    id: id,
    content: content,
    checked: false,
  });

  console.log(db);

  fs.writeFileSync("./data/db.json", JSON.stringify(db), () => {
    if (err) return console.log(err);
  });
}

function removeItem(id) {
  db.lists = db.lists.filter((item) => item.id != id);
  fs.writeFileSync("./data/db.json", JSON.stringify(db), () => {
    if (err) return console.log(err);
  });
}

function completed(id) {
  var item_isset = db.lists.findIndex((item) => item.id == id);
  if (item_isset != -1) {
    db.lists[item_isset].checked = !db.lists[item_isset].checked;
    fs.writeFileSync("./data/db.json", JSON.stringify(db), () => {
      if (err) return console.log(err);
    });
  }
}

function filterTask(status) {
  if (status == 1) {
    return db.lists.filter((item) => item.checked == true);
  } else if (status == 2) {
    return db.lists;
  } else {
    db.lists = [];
    fs.writeFileSync("./data/db.json", JSON.stringify(db), () => {
      if (err) return console.log(err);
    });
  }
}

module.exports = {
  db: db,
  addToList: addToList,
  removeItem: removeItem,
  completed: completed,
  filterTask: filterTask,
};
