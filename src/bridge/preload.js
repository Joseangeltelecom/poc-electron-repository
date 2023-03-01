const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // chatReply: () => ipcRenderer.invoke('chatReply'),
  // postReply: () => ipcRenderer.invoke('postReply'),
  chatReply: (data) => ipcRenderer.send('chatReply', data), // sending menssge from render to main
  postReply: (data) => ipcRenderer.send('postReply', data),
  sendToken: (token) => ipcRenderer.send('keycloak-token', token),
  handleMinimize: (callback) => ipcRenderer.on('window-minimized', callback), // sending message from main to render
  handleFocus: (callback) => ipcRenderer.on('window-focused', callback), // sending message from main to render
  handleTest: (data) => ipcRenderer.on('test', data), // sending message from main to render
});
