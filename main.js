const { app, BrowserWindow } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");
const socket = require("socket.io-client")("http://127.0.0.1:3001");

var hudCreated = false;
var playersCreated = false;

function createWindow() {
  require(path.join(__dirname, "backend", "index.js"));

  const mainWindow = new BrowserWindow({
    width: 1600,
    height: 800,
  });

  mainWindow.loadURL("http://localhost:9000");
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

function createHud() {
  hudWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    minimizable: false,
    fullscreen: true,
    frame: false,
    transparent: true,
  });

  hudWindow.setAlwaysOnTop(true, "screen-saver");
  setInterval(function () {
    hudWindow.setAlwaysOnTop(true, "screen-saver");
  }, 1);
  hudWindow.setIgnoreMouseEvents(true);

  hudWindow.loadURL("http://localhost:9000/hud");
}

function createPlayersWindow() {
  playersWindow = new BrowserWindow({
    width: 1600,
    height: 800,
  });

  playersWindow.loadURL("http://localhost:9000/players");
}

function toggleHUD() {
  if (hudCreated === false) {
    createHud();
    hudCreated = true;
  } else {
    hudWindow.close();
    hudCreated = false;
  }
}

function togglePlayers() {
  if (playersCreated === false) {
    createPlayersWindow();
    playersCreated = true;
  } else {
    playersWindow.close();
    playersCreated = false;
  }
}

socket.on("getToggleHUD", () => {
  toggleHUD();
});

socket.on("getTogglePlayers", () => {
  togglePlayers();
});
