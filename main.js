const path = require("path");
const server = require("./js-server/server");
const { app, BrowserWindow, ipcMain } = require("electron");

var win;
function createWindow() {
  win = new BrowserWindow({
    width: 400,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    resizable: false,
    icon: path.join(__dirname, "./assets/icon.png"),
  });
  win.loadFile(path.join(__dirname, "./index.html"));
  reload();
}
app.on("ready", createWindow);

ipcMain.on("add-to-list", (event, value) => {
  server.addToList(value);
  reload();
});

ipcMain.on("removeItem", (event, id) => {
  server.removeItem(id);
  reload();
});

ipcMain.on("completed", (event, id) => {
  server.completed(id);
  reload();
});

ipcMain.on("filterCompletedTask", (event, status) => {
  var data = server.filterTask(status);
  reload(data);
});
ipcMain.on("allTasks", (event, status) => {
  var data = server.filterTask(status);
  reload(data);
});
ipcMain.on("clearAllTask", (event, status) => {
  server.filterTask(status);
  reload();
});

function reload(data = server.db.lists) {
  win.webContents.send("loadData", data);
}
