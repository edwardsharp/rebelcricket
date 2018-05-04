import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-upload',
  template: `
    <mat-card>
      <mat-card-header>
        <h1>UPLOAD</h1>
      </mat-card-header>
      <mat-card-content>
        <p>Graphic files can be sent as ai, eps, pdf, psd, jpeg, or tiff.</p>
        <p>They should be sized to the desired print size at 300 dpi.</p>
        <p>Upload up to 10 files at once.</p>
        <input #gfxFile id="gfxFile" type="file" multiple="multiple" (change)="gfxFileChanged($event)" [disabled]="uploading" />
        <mat-progress-bar mode="indeterminate" [hidden]="!uploading"></mat-progress-bar>
        <mat-grid-list *ngIf="files" cols="2" rowHeight="1:1" gutterSize="5px" rowHeight="400px">
          <mat-grid-tile *ngFor="let file of files">
            <a href="/uploads/{{file.thumb}}" target="_blank"><img class="grid-img" alt="image file upload" src="/uploads/{{file.thumb}}" /></a>
            <mat-grid-tile-footer>
              <a mat-button href="/uploads/{{file.original}}" target="_blank">{{file.name}}</a>            
            </mat-grid-tile-footer>
          </mat-grid-tile>
        </mat-grid-list>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    'mat-card{ margin-top: 1em; margin-bottom: 1em; min-width: 75vw;}', 
    'p,input{margin: 1em}',
    '.grid-img{max-height: 100%;max-width: 100%;}'
  ]
})
export class UploadComponent implements OnInit {

  @ViewChild('gfxFile') gfxFile:ElementRef;

  res: any;
  files: Array<any>;
  uploading: boolean;

  constructor(private httpClient: HttpClient, private snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  gfxFileChanged(e:any){
    this.uploading = true;
    const formData = new FormData();
    if(e.target.files.length > 10){
      this.snackBar.open('Error! Please limit to 10 files or less.', '', {
        duration: 5000
      });  
      this.gfxFile.nativeElement.value = '';
      this.uploading = false;
    }else{
      for (const file of e.target.files) {
        formData.append('files', file);
      }
      this.httpClient.post('/upload', formData)
        .subscribe(
          res => {
            console.log('response:',res);
            this.gfxFile.nativeElement.value = '';
            this.res = JSON.parse(JSON.stringify(res));
            this.files = res["files"];
            this.uploading = false;
            //since the imagemagick conversion is async, do this hack to reload img srcz
            setTimeout(() => {
              this.files.map( f => { f.thumb = f.thumb+'?r='+Date.now(); return f; });
            }, 2500);
            setTimeout(() => {
              this.files = this.res.files.map( f => { f.thumb = f.thumb+'?r='+Date.now(); return f; });
            }, 10000);
          },
          err => {
            console.log("Error occured err:",err);
            this.gfxFile.nativeElement.value = '';
            this.uploading = false;
            this.snackBar.open('Upload Error!', '', {
              duration: 2000
            });  
          }
        );
    }
  }

}
