const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
const {Menu} = require('electron')
const {ipcMain} = require('electron')
const fs = require('fs');
const http = require('http');
const css = require('css');
const read = require('read-css')
const path = require('path');
const url = require('url');
const express = require('express')
const server = express()

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 1200, 
        height: 600, 
        minWidth: 1200,
        minHeight: 600});
    // titleBarStyle: 'hiddenInset'
    // and load the index.html of the app.
    const startUrl = process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, '/../build/index.html'),
        protocol: 'file:',
        slashes: true
    });
    mainWindow.loadURL(startUrl);
    
    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
    let pathJoiner = path.join
    ipcMain.on('htmlToPdf', (event, path, htmlString)=> {
        previewWindow = new BrowserWindow({width: 600,
            height: 1000,
            minWidth: 300,
            minHeight: 500})
        // const previewUrl = url.format({
        //     pathname: pathJoiner(__dirname, '/../build/index.html#/preview'),
        //     protocol: 'file:',
        //     slashes: true
        // });
        server.set('views', __dirname);
        server.set('view engine', 'pug')
        server.get('/', (req, res) => {
            res.set('Content-Type', 'text/html');
            res.render('preview', { innerHtmlContent: htmlString})
            // res.render('<link rel="stylesheet" type="text/css" src="index.css">'+
            // htmlString)
        })
        let instance = server.listen(1337, () => console.log('Preview on port 1337!'))
        previewWindow.loadURL('http://localhost:1337')
        // setTimeout(() => {
            
        // }, 2000);
        previewWindow.webContents.openDevTools();
        previewWindow.on('close', () => { //   <---- Catch close event
            instance.close();
            previewWindow = null
        });
        // var htmlAppend = 'document.body.innerHTML = '+htmlString
        // previewWindow.webContents.executeJavaScript(htmlAppend)
        // previewWindow.webContents.reload() 
        // previewWindow.loadURL('data:text/html;charset=utf-8,'+encodeURI('<link rel="stylesheet" type="text/css" src="index.css">'+htmlString));
        // previewWindow.webContents.on('did-finish-load', function() {
        //     // this is with async way
        //     // fs.readFile(__dirname+ '/index.css', 'utf-8', function(error, data) {
        //     //     if(!error){
        //     //         mainWindow.webContents.insertCSS(data)
        //     //     }
        //     // })
        //     read('example.css', function(err, data){
        //         if(!err) {
        //             var cssString = css.stringify(data);
        //             mainWindow.webContents.insertCSS(cssString)

        //         }
        //     });
        // });



        // http.createServer(function (req, res) {
        //   res.write('<html><head><link rel="stylesheet" href="src/index.css"></head><body>');
        //   res.write(htmlString);
        //   res.end('</body></html>');
        // }).listen(1337);
    })
    const template = [
      {
        label: 'File',
        submenu: [
          {
            label: 'New',
            role: 'new',
            accelerator: 'CmdOrCtrl+N',
            click (item) {
              mainWindow.webContents.send('openNewFile')
            }
          },
          {
            label: 'Open',
            role: 'open',
            accelerator: 'CmdOrCtrl+O',
            click (item) {
              mainWindow.webContents.send('openFile')
            }
          },
          {
            label: 'Save',
            role: 'save',
            accelerator: 'CmdOrCtrl+S',
            click (item) {
              mainWindow.webContents.send('saveFile')
            }
          },
          {
            label: 'Save As',
            role: 'save as',
            accelerator: 'CmdOrCtrl+A',
            click (item) {
              mainWindow.webContents.send('saveFileAs')
            }
          },
          {
            label: 'Export as PDF',
            role: 'export',
            accelerator: 'CmdOrCtrl+E',
            click (item) {
              mainWindow.webContents.send('exportFile')
            }
          },
          {
            label: 'Listen',
            click (item) {
              mainWindow.webContents.send('openListeningTool')
            }
          }
        ]
      },
      {
        label: 'Edit',
        submenu: [
          {
            role: 'undo'
          },
          {
            role: 'redo'
          },
          {
            type: 'separator'
          },
          {
            role: 'cut'
          },
          {
            role: 'copy'
          },
          {
            role: 'paste'
          },
          {
            role: 'pasteandmatchstyle'
          },
          {
            role: 'delete'
          },
          {
            role: 'selectall'
          }
        ]
      },
      {
        label: 'View',
        submenu: [
          {
            label: 'Reload',
            accelerator: 'CmdOrCtrl+R',
            click (item, focusedWindow) {
              if (focusedWindow) focusedWindow.reload()
            }
          },
          {
            label: 'Toggle Developer Tools',
            accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
            click (item, focusedWindow) {
              if (focusedWindow) focusedWindow.webContents.toggleDevTools()
            }
          },
          {
            type: 'separator'
          },
          {
            role: 'resetzoom'
          },
          {
            role: 'zoomin'
          },
          {
            role: 'zoomout'
          },
          {
            type: 'separator'
          },
          {
            role: 'togglefullscreen'
          }
        ]
      },
      {
        role: 'window',
        submenu: [
          {
            role: 'minimize'
          },
          {
            role: 'close'
          }
        ]
      },
      {
        role: 'help',
        submenu: [
          {
            label: 'Learn More',
            click () { require('electron').shell.openExternal('http://electron.atom.io') }
          }
        ]
      }
    ]

    if (process.platform === 'darwin') {
      const name = app.getName()
      template.unshift({
        label: name,
        submenu: [
          {
            role: 'about'
          },
          {
            type: 'separator'
          },
          {
            role: 'services',
            submenu: []
          },
          {
            type: 'separator'
          },
          {
            role: 'hide'
          },
          {
            role: 'hideothers'
          },
          {
            role: 'unhide'
          },
          {
            type: 'separator'
          },
          {
            role: 'quit'
          }
        ]
      })
      // Edit menu.
      template[1].submenu.push(
        {
          type: 'separator'
        },
        {
          label: 'Speech',
          submenu: [
            {
              role: 'startspeaking'
            },
            {
              role: 'stopspeaking'
            }
          ]
        }
      )
      // Window menu.
      template[3].submenu = [
        {
          label: 'Close',
          accelerator: 'CmdOrCtrl+W',
          role: 'close'
        },
        {
          label: 'Minimize',
          accelerator: 'CmdOrCtrl+M',
          role: 'minimize'
        },
        {
          label: 'Zoom',
          role: 'zoom'
        },
        {
          type: 'separator'
        },
        {
          label: 'Bring All to Front',
          role: 'front'
        }
      ]
    }

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.