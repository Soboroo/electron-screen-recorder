const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
	selectSource: (source) => {
		ipcRenderer.on('source-selected', source);
	},
	createVideoSourcesMenu: async () => {
		ipcRenderer.invoke('createVideoSourcesMenu');
	},
	showDialog: (options, array) => {
		ipcRenderer.invoke('showDialog', options, array);
	}
});