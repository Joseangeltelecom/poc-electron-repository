const {
  app,
  BrowserWindow,
  Menu,
  nativeImage,
  Tray,
  ipcMain,
  Notification,
} = require("electron");
// let http = require('http');
// let fs = require('fs');
// let path = require('path');

const isDev = require("electron-is-dev");

let mainWindow, tray;
const devPath = "http://localhost:3000";
const prodPath = `file://${app.getAppPath()}/build/index.html`;
const iconPath = `${app.getAppPath()}/build/admin/isotipo-meetPoint.ico`;
const url = isDev ? devPath : prodPath;

// // Servidor:
// const Keycloak = http.createServer((request, response) => {
//   response.writeHeader(200, { 'Content-Type': 'text/html' });
//   // eslint-disable-next-line no-undef
//   // let readSream = fs.createReadStream(__static + '/index.html', 'utf8');
//   let readSream = fs.createReadStream(prodPath, 'utf8');
//   readSream.pipe(response);
// });
// Keycloak.listen(3000);

// // Escuchando Token:
// ipcMain.on('keycloak-token', (event, token) => {
//   const winURL = isDev
//     ? `http://localhost:3000?token=${token}`
//     : `file://${__dirname}/index.html?token=${token}`;

//   mainWindow.loadURL(winURL);
// });

// Creates a new window with the specified dimensions and options.
const createWindow = () => {
  if (!tray) {
    createTray();
  }
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 1024,
    title: "Meetpoint desktop",
    icon: iconPath,
    webPreferences: {
      nodeIntegration: true,
      preload: `${app.getAppPath()}/src/bridge/preload.js`,
    },
  });

  mainWindow.loadURL(url);

  const {
    session: { webRequest },
  } = mainWindow.webContents;

  const filter = {
    urls: ["http://localhost:3000*"],
  };

  webRequest.onBeforeRequest(filter, async ({ url }) => {
    console.log("entro");
    const params = url.slice(url.indexOf("#"));
    // eslint-disable-next-line no-console
    console.log(params);
    // eslint-disable-next-line no-console
    // console.log(prodPath + params);
    const indexHtmlPath = `${app.getAppPath()}/build/index.html`;
    // mainWindow.loadURL('file://' + indexHtmlPath + params);
    // eslint-disable-next-line no-console
    console.log("file://" + indexHtmlPath + params);
    isDev
      ? mainWindow.loadURL(devPath)
      : mainWindow.loadURL("file://" + indexHtmlPath + params);
  });
  // if (isDev) mainWindow.loadURL(devPath);

  // ipcMain.handle('chatReply', () => 'pong');

  ipcMain.on("chatReply", (_event, data) => {
    const notification = new Notification({
      title: "You have a new message.",
      body: data,
    });

    notification.on("click", () => {
      mainWindow.show();
      mainWindow.webContents.send("test", "Notification clicked");
    });

    notification.show();

    mainWindow.on("minimize", () => {
      mainWindow.webContents.send("window-minimized", true);
    });

    mainWindow.on("restore", () => {
      mainWindow.webContents.send("window-minimized", false);
    });

    mainWindow.on("focus", () => {
      mainWindow.webContents.send("window-focused", true);
    });

    mainWindow.on("blur", () => {
      mainWindow.webContents.send("window-focused", false);
    });
  });

  mainWindow.on("close", function (event) {
    if (BrowserWindow.getAllWindows().length === 0) {
      app.quit();
    } else {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  tray.on("click", () => {
    mainWindow.show();
  });
};

// Creates a new tray icon with a context menu containing options to show the app or quit.
function createTray() {
  const icon = iconPath;
  const trayicon = nativeImage.createFromPath(icon);
  tray = new Tray(trayicon.resize({ width: 16 }));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Show App",
      click: () => mainWindow.show(),
    },
    {
      label: "Quit",
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);
}

// When Electron has finished initializing, create a new window.
app.whenReady().then(createWindow);

// When the app is activated, create a new window if none exist.
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("before-quit", () => {
  app.quit();
});

// When all windows are closed, hide the Dock icon (if it exists).
app.on("window-all-closed", () => {
  app.dock?.hide();
});
