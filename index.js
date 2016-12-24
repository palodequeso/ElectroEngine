const path = require('path');
const fs = require('fs');

const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow;

function createWindow() {

    var resolution = [800, 600];
    var maximize = true;
    var index_path = `file://${__dirname}/editor/index.html`;
    var open_dev_tools = true;
    var dev_tool_size = 500;
    if (process.argv[2] && process.argv[2].startsWith('--')) {
        var game_folder = process.argv[2].slice(2);
        index_path = `file://${__dirname}/${game_folder}/index.html`;
        console.log(path.join(__dirname, game_folder, 'config.json'));
        try {
            var config = JSON.parse(fs.readFileSync(path.join(__dirname, game_folder, 'config.json'), 'utf-8'));
            resolution = config.resolution;
            maximize = config.maximize;
            open_dev_tools = config.open_dev_tools;
            dev_tool_size = config.dev_tool_size;
        } catch (e) {
            console.log("Config doesn't exist, or doesn't have both resolution array and maximize, using defaults.");
        }
    }

    // Create the browser window.
    mainWindow = new BrowserWindow({width: resolution[0] + (open_dev_tools ? dev_tool_size : 0),
                                    height: resolution[1], autoHideMenuBar: true});
    if (maximize) {
        mainWindow.maximize();
    }
    // and load the index.html of the app.
    mainWindow.loadURL(index_path);

    // Open the DevTools.
    if (open_dev_tools) {
        mainWindow.webContents.openDevTools();
    }

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
