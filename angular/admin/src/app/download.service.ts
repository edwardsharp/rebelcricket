import { Injectable } from '@angular/core';

declare global {
  interface Window {
    require: any;
  }
}

const electron = window.require('electron');

@Injectable()
export class DownloadService {

  constructor() { }

  downloadFile(url:string){
  	console.log('[download.service] gonna downloadFile:',url);
  	electron.ipcRenderer.send("download", url);
  }

  syncUpload(url:string){
  	electron.ipcRenderer.send("syncUpload", url);
  }

}
