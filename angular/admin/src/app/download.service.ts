import { Injectable } from '@angular/core';

declare global {
  interface Window {
    require: any;
  }
}

let electron;
try{
  electron = window.require('electron');
}catch(e){}

@Injectable()
export class DownloadService {

  constructor() { }

  downloadFile(url:string){
  	console.log('[download.service] gonna downloadFile:',url);
  	try{
      electron.ipcRenderer.send("download", url);
    }catch(e){}
  }

  syncUpload(url:string){
    try{
    	electron.ipcRenderer.send("syncUpload", url);
    }catch(e){}
  }

}
