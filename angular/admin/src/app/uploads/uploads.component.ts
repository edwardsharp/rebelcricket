import { Component, OnInit } from '@angular/core';

import { Attachments } from '../orders/order';
import { DownloadService } from '../download.service';
import { environment } from '../../environments/environment';

declare var PouchDB:any;

@Component({
  selector: 'app-uploads',
  template: `
  <div id="uploads">
    <mat-list *ngFor="let upload of uploads">
      <button mat-button (click)="removeDoc(upload)"><mat-icon>delete</mat-icon> Delete {{upload.files.length}} upload{{upload.files.length > 1 ? 's' : ''}}</button>
      <small *ngIf="upload.date">{{upload.date | date:'short'}}</small>
      <mat-list-item *ngFor="let file of upload.files">
        <a href="{{uploadHost()}}/{{file.original}}" target="_blank" >
          <img matListAvatar src="{{uploadHost()}}/{{file.thumb}}" alt="{{file.name}}">
        </a>
        <h3 matLine class="truncate">
          <button mat-button (click)="download(file.original)" matTooltip="Save {{file.name}}"><mat-icon>file_download</mat-icon> {{file.name}}</button>
        </h3>
      </mat-list-item>
    </mat-list>
  </div>
  `,
  styles: ['#uploads{display: flex; flex-wrap: wrap;}', 
  'mat-list{max-width:100vw; display:flex;flex-direction:column;text-align:center;border-bottom: thin solid #eeeeee;}',
  '.mat-list-avatar:hover{border-radius: 0;}',
  '.truncate{white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:90%; display:block;}']
})
export class UploadsComponent implements OnInit {

  db: any;
  uploads: Array<Attachments>;

  constructor(private downloadService: DownloadService) {
    if(navigator.vendor && navigator.vendor.indexOf('Apple') > -1){
      console.log("LOADING FRUITDONW DB!");
      this.db = new PouchDB(`${environment.couch_host}/uploads`, {adapter: 'fruitdown'});
    }else{
      this.db = new PouchDB(`${environment.couch_host}/uploads`);
    }

    //#todo: watch for changes...

    this.db.allDocs({
      include_docs: true,
      attachments: false,
      // startkey: start,
      // endkey: `${start}\ufff0`
    }).then( docs => {
      console.log('got uplaods: ',docs);
      this.uploads = docs.rows.map( r => r.doc );
    });

  }

  ngOnInit() {
  }

  removeDoc(doc:any){
    this.db.remove(doc).then( resp => {
      this.uploads.splice(this.uploads.indexOf(doc), 1);
    });
  }

  uploadHost(): string{
    return environment.upload_host;
  }

  download(url:string): void{
    this.downloadService.downloadFile(`${environment.upload_host}/${url}`);
  }

}
