/* PRINT SIZE'R 
* ------------
* a little utility to show image scale on real-world
* itemz, like apparel (t-shirts, hats, etc.) or posters.
* generally assuming print resolution of 300dpi. 
*
* 3dwardsharp
*/
import { Component, Inject, OnInit, AfterContentInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';
import { MatSnackBar, MatAutocompleteSelectedEvent } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Location} from '@angular/common';

import { OrderService } from '../orders/order.service';
import { Order } from '../orders/order';
import { Color, COLORS } from './color';


import { fabric } from 'fabric';
// declare var fabric:any;
// declare var initFabricFilters:any;
declare var PouchDB: any;

// declare var addWheelListener: any;
// creates a global "addWheelListener" method (from mdn)
// example: addWheelListener( elem, function( e ) { console.log( e.deltaY ); e.preventDefault(); } );
// !function(e,t){function l(t,l,r,d){t[n](o+l,"wheel"==a?r:function(t){!t&&(t=e.event);var l={originalEvent:t,target:t.target||t.srcElement,type:"wheel",deltaMode:"MozMousePixelScroll"==t.type?0:1,deltaX:0,deltaY:0,deltaZ:0,preventDefault:function(){t.preventDefault?t.preventDefault():t.returnValue=!1}};return"mousewheel"==a?(l.deltaY=-.025*t.wheelDelta,t.wheelDeltaX&&(l.deltaX=-.025*t.wheelDeltaX)):l.deltaY=t.deltaY||t.detail,r(l)},d||!1)}var n,a,o="";e.addEventListener?n="addEventListener":(n="attachEvent",o="on"),a="onwheel"in t.createElement("div")?"wheel":void 0!==t.onmousewheel?"mousewheel":"DOMMouseScroll",e.addWheelListener=function(e,t,n){l(e,a,t,n),"DOMMouseScroll"==a&&l(e,"MozMousePixelScroll",t,n)}}(window,document);

@Component({
  selector: 'app-gfx',
  templateUrl: './gfx.component.html',
  styleUrls: ['./gfx.component.css']
})
export class GfxComponent implements OnInit, AfterContentInit {

  gfx: Order;

  // plate: {name: string, value: string};
  plate: {value: string, 
        viewValue: string, 
        frontTop: {top: number, left: number},
        frontCenter: {top: number, left: number}, 
        backTop: {top: number, left: number},
        backCenter: {top: number, left: number}}

  name: string = "New Plate";

  // plateControl = new FormControl();
  plateGroups = [
    {
      name: 'T-Shirt',
      plates: [{
        value: 'tshirt-m', 
        viewValue: 'Medium T-Shirt', 
        frontTop: {top: 3300, left: 5432},
        frontCenter: {top: 5030, left: 5432},
        backTop: {top: 2750, left: 17232}, 
        backCenter: {top: 4300, left: 17232} 
      }]
    },
    {
      name: 'Hoodie',
      disabled: true,
      plates: [
        { value: 'hoodie-m', viewValue: 'Medium Hoodie' }
      ]
    },
    {
      name: 'Long Sleeve',
      disabled: true,
      plates: [
        { value: 'longsleeve-m', viewValue: 'Medium Long Sleeve' }
      ]
    },
    {
      name: 'Tank',
      disabled: true,
      plates: [
        { value: 'tank-m', viewValue: 'Medium Tank' }
      ]
    }
  ];

	objectToolsHidden = true;

	canvas: any;

  selectedLayer: string;
  showLayerPanel: boolean;
  
  toggleNav: boolean = false;
  //#TODO: these all need to be gfx.* propertyz...
  // canvasLayers: Array<string> = [];
  // attachmentDimensions = {};
  // canvasLayerColors = {} //: { layerKey: Array<string> };
  
  colorCtrl: FormControl;
  filteredColors: Observable<any[]>;
  colors: Color[] = COLORS;

  // @ViewChild('c') c; 
  @ViewChild('orderDesignFile') orderDesignFile;

  canvasHeight: number;
  canvasWidth: number;
  plateObj: any;
  zoomVal: number = 0.5;
  panning: boolean = false;
  selecting: boolean = false;
  uploading: boolean = false;
  showRuler: boolean = true;

  constructor(
    private gfxService: OrderService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer,
    public dialog: MatDialog,
    private location: Location
  ){ 
    this.colorCtrl = new FormControl();
    this.filteredColors = this.colorCtrl.valueChanges
      .pipe(
        startWith(''),
        map(color => color ? this.filterColors(color) : this.colors.slice())
      );
  }

  ngOnInit() {
    this.route.paramMap
      .switchMap((params: ParamMap) => this.gfxService.getOrder( params.get('id') ))
      .subscribe((gfx: Order) => {
        if(gfx && gfx['_rev'] && gfx['_id'] == this.route.snapshot.params.id){
          this.gfx = gfx;
          if(this.gfx.attachmentDimensions == undefined){
            this.gfx.attachmentDimensions = {};
          }
          if(this.gfx.canvasLayers == undefined){
            this.gfx.canvasLayers = [];
          }
          if(this.gfx.canvasLayerColors == undefined){
            this.gfx.canvasLayerColors = {};
          }

          if(this.gfx.canvasData){
            setTimeout(() => {
              this.canvas.loadFromDatalessJSON(this.gfx.canvasData, () => {
                this.drawRulers();
                this.canvas.renderAll(); 
                this.snackBar.dismiss();
              },function(o,object){
                // console.log('onoz, loadFromJSON err:',o,object)
              });
            }, 500);
            this.snackBar.open('Loading canvas...', '', {
              duration: 2000,
            }); 
          }else{
            this.drawRulers();
          }
        }else if(gfx._id){
          this.gfx = gfx;
          this.drawRulers();
          this.location.replaceState("/dashboard/gfx/"+gfx._id);
          this.snackBar.open('New Gfx Created!', '', {
            duration: 5000,
          });          
        } 
      });
  }

  ngAfterContentInit() {

    Observable.fromEvent(window, 'resize')
      .debounceTime(500)
      .subscribe((event) => {
        this.resizeCanvas(event);
      });

    this.canvas = new fabric.Canvas('c', {
      selection: false,
      renderOnAddRemove: false,
      stateful: false
    });

    // addWheelListener(document, e => {
    //   // mouse wheel event
    //   this.canvas.relativePan(new fabric.Point(-e.deltaX, -e.deltaY));
    // });

    this.drawRulers();

    this.canvas.on('mouse:up', e => {
      this.panning = false;
    });

    this.canvas.on('mouse:down', e => {
      this.panning = true;
    });
    this.canvas.on('mouse:move', e => {
      if (!this.selecting && this.panning && e && e.e) {
        var delta = new fabric.Point(e.e.movementX, e.e.movementY);
        this.canvas.relativePan(delta);
      }
    });

    //mouse:wheel ?

    this.canvas.on('selection:created', e => {
      this.selecting = true;
      this.showLayerPanelFor(e.target.id);
    });
    this.canvas.on('selection:updated', e => {
      this.selecting = true;
      this.showLayerPanelFor(e.target.id);
    });
    this.canvas.on('selection:cleared', e => {
      this.selecting = false;
      this.selectedLayer = undefined;
      this.showLayerPanel = false;
    });


    this.resizeCanvas('');
    this.canvas.setZoom(0.5);

  }

  resizeCanvas(event): void {
    try{
      this.canvasHeight = document.documentElement.clientHeight - 64;
      this.canvasWidth = document.documentElement.clientWidth;
      this.canvas.setWidth(this.canvasWidth);
      this.canvas.setHeight(this.canvasHeight);
    }catch(e){ console.log('o noz! caught e in resizeCanvas e:',e); }
  }

  plateChange(plateItem): void{
    if(this.plate != plateItem && plateItem.value && plateItem.value.length > 2){
      this.gfx.plate = plateItem;
      this.plate = plateItem;
      this.loadSVG(plateItem.value);
    }else if(plateItem == 'clear'){
      this.canvas.remove(this.plateObj);
      this.plate = undefined;
      this.gfx.plate = undefined;
      this.canvas.renderAll();
    }
  }

  loadSVG(id):void {
    fabric.loadSVGFromURL(`/assets/gfx/${id}.svg`, (objects, options) => {
      this.plateObj = fabric.util.groupSVGElements(objects, options);
      this.plateObj.selectable = false;
      this.plateObj.hasControls = false
      this.plateObj.hasBorders = false
      this.plateObj.lockMovementX = true
      this.plateObj.lockMovementY = true
      this.plateObj.scaleX = 0.1;
      this.plateObj.scaleY = 0.1;
      this.plateObj.top = 60;
      this.plateObj.left = 60;
      this.plateObj.setCoords();
      this.canvas.add(this.plateObj);

      this.gfx.canvasLayers.forEach((l) => {
        this.canvas.getObjects().forEach((o) => {
          if(o.id === l) { o.bringToFront(); }
        });
      });
      this.canvas.renderAll();
      // console.log('loadSVG JSON.stringify(this.canvas):',JSON.stringify(this.canvas));
    });
  }

  zoom(e): void {
    this.canvas.setZoom(e.value);
    this.canvas.renderAll();
  }

  zoomReset(e): void {
    this.zoomVal = 0.5;
    this.canvas.setZoom(0.5);
    this.canvas.absolutePan(new fabric.Point(0, 0));
    this.canvas.renderAll();
  }

  drawRulers(): void{
    var grid = 30; //e.g. DPI
    var width = 2600; // ~2x tshirtz 
    var measurementThickness = 60;
    var minorFontSize = 24;
    var majorFontSize = 26;
    var rulerItems = [];

    rulerItems.push(new fabric.Rect({
      left: 0,
      top: 0,
      fill: '#DDD',
      selectable: false,
      width: measurementThickness,
      height: 2660,
      excludeFromExport: true
    }));

    rulerItems.push(new fabric.Rect({
      left: 0,
      top: 0,
      fill: '#DDD',
      width: 2660,
      selectable: false,
      height: measurementThickness,
      excludeFromExport: true
    }));

    var tickSize = 10;
    var tickSizeFoot = 40;
    var count = 1;
    var footCount = 0;

    for (var i = 0; i < (width / grid); i++) {
      var offset = (i * grid),
        location1 = offset + measurementThickness,
        isFoot = ((i + 1) % 12) === 0 && i !== 0;

      // vertical grid
      rulerItems.push(new fabric.Line([location1, measurementThickness, location1, width], {
        stroke: isFoot ? '#888' : '#ccc',
        selectable: false,
        excludeFromExport: true
      }));

      // horizontal grid
      rulerItems.push(new fabric.Line([measurementThickness, location1, width, location1], {
        stroke: isFoot ? '#888' : '#ccc',
        selectable: false,
        excludeFromExport: true
      }));

      // left ruler
      rulerItems.push(new fabric.Line([measurementThickness - tickSize, location1, measurementThickness, location1], {
        stroke: '#888',
        selectable: false,
        excludeFromExport: true
      }));
      rulerItems.push(new fabric.Text(count.toString(), {
        left: measurementThickness - (tickSize * 2 + 10),
        top: location1,
        selectable: false,
        fontSize: minorFontSize,
        fontFamily: 'san-serif',
        excludeFromExport: true
      }));

      if (isFoot) {
        footCount++;
        rulerItems.push(new fabric.Line([measurementThickness - tickSizeFoot, location1, measurementThickness, location1], {
          stroke: '#222',
          selectable: false,
        excludeFromExport: true
        }));
        rulerItems.push(new fabric.Text(footCount + "\'", {
          left: measurementThickness - (tickSizeFoot + 10),
          top: location1 + 4,
          selectable: false,
          fontSize: majorFontSize,
          fontFamily: 'san-serif',
          excludeFromExport: true
        }));
      }

      // top ruler
      rulerItems.push(new fabric.Line([location1, measurementThickness - tickSize, location1, measurementThickness], {
        stroke: '#888',
        selectable: false,
        excludeFromExport: true
      }));
      rulerItems.push(new fabric.Text(count.toString(), {
        left: location1 + 3,
        top: measurementThickness - (tickSize * 2) - 4,
        selectable: false,
        fontSize: minorFontSize,
        fontFamily: 'san-serif',
        excludeFromExport: true
      }));

      if (isFoot) {
        rulerItems.push(new fabric.Line([location1, measurementThickness - tickSizeFoot, location1, measurementThickness], {
          stroke: '#222',
          selectable: false,
          excludeFromExport: true
        }));
        rulerItems.push(new fabric.Text(footCount + "\'", {
          left: location1 + 10,
          top: measurementThickness - (tickSizeFoot) - 7,
          selectable: false,
          fontSize: majorFontSize,
          fontFamily: 'san-serif',
          excludeFromExport: true
        }));
      }

      count++
    } //for()

    var rulerGroup = new fabric.Group(rulerItems);
    rulerGroup.excludeFromExport = true;
    this.canvas.add(rulerGroup);
    this.canvas.sendToBack(rulerGroup);

  } //drawRulers()

  saveGfx(){

    this.gfx.canvasData = this.canvas.toDatalessJSON(['id','selectable','lockScalingX', 'lockScalingY', 'hasControls', 'hasBorders', 'lockMovementX', 'lockMovementY']);    
    
    this.canvas.getObjects().forEach((o) => {
      if(o.excludeFromExport) {
        o.opacity = 0;
        this.canvas.renderAll();
      }
    });
    this.gfx.canvasDataImg = this.canvas.toDataURL({format: 'png', width: 1200, height: 550});
    this.canvas.getObjects().forEach((o) => {
      if(o.excludeFromExport) {
        o.opacity = 1;
        this.canvas.renderAll();
      }
    });

    this.gfxService.saveOrder(this.gfx).then(resp => {
      if(resp["rev"]){
        this.gfx._rev = resp["rev"];
      }

      this.gfxService.getOrder(this.gfx._id).then( gfx => {
        this.gfx = gfx;
      }, err => console.log('o noz, getOrder err:',err));

      this.snackBar.open('Saved!', '', {
        duration: 2000,
      });

    }, err =>{
      console.log('o noz! saveOrder err:',err);
      this.snackBar.open('Error! Could not save.', '', {
        duration: 3000,
      });
    });
  }

  gfxFileChanged(e:any){
    this.uploading = true;
    this.gfx._attachments = this.gfx._attachments || {};
    let description;
    for(let file of e.target.files){
      description = description ? `${description}, ${file.name}` : file.name;
      this.gfx._attachments[file.name] = {
        "content_type": file.type,
        "data": file
      }
    }

    this.gfx.history = this.gfx.history || [];
    this.gfx.history.push({date: new Date, title: `Added ${e.target.files.length} GFX Attachment${e.target.files.length > 1 ? 's' : ''}`, description: description});

    this.gfxService.saveOrder(this.gfx).then(resp => {
      if(resp["rev"]){
        this.gfx._rev = resp["rev"];
      }

      this.gfxService.getOrder(this.gfx._id).then( gfx => this.gfx = gfx, err => console.log('o noz, getOrder err:',err));

      let msg = '';
      if(e.target.files.length == 0){
        msg = `Attachment ${e.target.files[0].file.name} Saved!`;
      }else{
        msg = `${e.target.files.length} Attachments Saved!`
      }
      setTimeout( () => {
        for(var i=0; i < e.target.files.length; i++){
          this.getDimensionsFor(e.target.files[i].name);
          this.addLayerToCanvas(e.target.files[i].name);
        }
      },1000);

      this.uploading = false;
      this.snackBar.open(msg, '', {
        duration: 2000,
      });

    }, err =>{
      console.log('o noz! saveOrder err:',err);
      this.snackBar.open('Error! Could not save attachment(s).', '', {
        duration: 3000,
      });
      this.uploading = false;
    });

  }

  attachmentItemsForGfx(){
    return this.gfx._attachments ? Object.keys(this.gfx._attachments) : [];
  }
  
  attachmentSrcFor(gfx:Order,itemKey:string){
    try{
      const content_type = gfx["_attachments"][itemKey]["content_type"];
      //this.sanitizer.bypassSecurityTrustUrl(
      const data = gfx["_attachments"][itemKey]["data"];
      return (data && content_type && content_type.match(/image/i)) ? `data:${content_type};base64,${data}` : ''; 
    }catch(err){
      return '';
    }      
  }

  getDimensionsFor(itemKey:string): void {
    try{
      const content_type = this.gfx["_attachments"][itemKey]["content_type"];
      const data = this.gfx["_attachments"][itemKey]["data"];
      if(data && content_type && content_type.match(/image/i)){
        var img = new Image();
        img.onload = () => {
          let height = (img.height / 300).toFixed(2);
          let width = (img.width / 300).toFixed(2);
          this.gfx.attachmentDimensions[itemKey] = `h:${height}" w:${width}"`;
          this.saveGfx();
        };
        img.src = `data:${content_type};base64,${data}`;
      }
    }catch(err){ console.log('dimensionsFor err:',err); } 
  }

  deleteAttachmentFor(itemKey:string){

    this.gfxService.removeAttachment(this.gfx._id, itemKey, this.gfx._rev).then(result => {
      // handle result
      this.snackBar.open('Attachment removed', '', {
        duration: 2000,
      });
      if(result["rev"]){
        this.gfx._rev = result["rev"];
      }
      try{
        delete this.gfx._attachments[itemKey];
        this.removeLayer(itemKey);
      }catch(err){ console.log('o noz! delete _attachments err:',err); }
    }).catch(function (err) {
      console.log('o noz! removeAttachment err:',err);
    });
  }

  showLayerPanelFor(itemKey:string){
    this.selectedLayer = itemKey;
    this.showLayerPanel = true;
    if(!this.canvas.getActiveObject() || this.canvas.getActiveObject().id != itemKey){
      this.canvas.getObjects().forEach((o) => {
        if(o.id === itemKey) {
          this.canvas.setActiveObject(o);
          this.canvas.renderAll();
        }
      });
    }
  }
  hideLayerPanel(){
    this.selectedLayer = undefined;
    this.showLayerPanel = false;
  }

  addLayerToCanvas(itemKey:string){
    if(this.gfx.canvasLayers.indexOf(itemKey) < 0){
      let idExists = false;
      this.canvas.getObjects().forEach((o) => {
        if(o.id === itemKey) {
          idExists = true
        }
      });
      if(!idExists){
        this.gfx.canvasLayers.push(itemKey);
        if(this.gfx.canvasLayerColors[itemKey] == undefined){
          this.gfx.canvasLayerColors[itemKey] = [];
        }
        
        let _canvas = this.canvas;
        fabric.Image.fromURL(this.attachmentSrcFor(this.gfx, itemKey), function(i) {
          i.scaleX = 0.1;
          i.scaleY = 0.1;
          i.originX = 'center';
          i.originY = 'center';
          i.top = (i.height * 0.05) + 60;
          i.left = (i.width * 0.05) + 60;
          i.setCoords();
          // i.lockRotation = true;
          i.lockScalingX = i.lockScalingY = true;
          // i.hasControls = false;
          i.setControlsVisibility({
            mt: false, 
            mb: false, 
            ml: false, 
            mr: false, 
            bl: false,
            br: false, 
            tl: false, 
            tr: false,
            mtr: true
          });
          i.centeredRotation = true;
          //i.hasBorders = false;
          i.id = itemKey;
          _canvas.add(i); 
          _canvas.setActiveObject(i);
          _canvas.renderAll();
        });
      }
    }
  }

  removeLayer(itemKey:string){
    try{
      this.canvas.remove(this.canvas.getActiveObject());
      this.canvas.renderAll();
      this.hideLayerPanel();
      delete this.gfx.canvasLayerColors[itemKey];
      this.gfx.canvasLayers.splice(this.gfx.canvasLayers.indexOf(itemKey), 1);
    }catch(e){ console.log('could not remove layer:',itemKey,' e:',e); }
  }

  isCanvasLayer(itemKey:string): boolean{
    return this.gfx.canvasLayers.indexOf(itemKey) > -1;
  }

  sendObject(dir:string): void{
    if(dir == 'backwards'){
      this.canvas.getActiveObject().sendBackwards();
    }else if(dir == 'back'){
      this.canvas.getActiveObject().sendToBack();
    }else if(dir == 'forewards'){
      this.canvas.getActiveObject().brintForwards();
    }else if(dir == 'front'){
      this.canvas.getActiveObject().bringToFront();
    }
    this.canvas.renderAll();
  }

  rotateObject(): void{
    let _currentAngle = this.canvas.getActiveObject().get('angle');
    if(_currentAngle % 90 != 0){
      _currentAngle = _currentAngle - (_currentAngle % 90);
    }
    this.canvas.getActiveObject().rotate(_currentAngle + 90);
    this.canvas.renderAll();
  }

  centerObject(on:string): void{
    this.canvas.getActiveObject().set({
      top: (this.plate[on].top * 0.1) + 60,
      left: (this.plate[on].left * 0.1) + 60
    });
    this.canvas.renderAll();
  }

  openNotesDialog(): void {
    let dialogRef = this.dialog.open(NotesDialog, {
      data: { notes: this.gfx.notes }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.gfx.notes = result;
    });
  }

  initCanvasLayerColors(selectedLayer: string): boolean{
    if(this.gfx.canvasLayerColors[selectedLayer] == undefined){
      this.gfx.canvasLayerColors[selectedLayer] = [];
    }
    return this.gfx.canvasLayerColors[selectedLayer].length > -1;
  }

  addColorFor(selectedLayer:string, color:string): void{
    if(this.gfx.canvasLayerColors[selectedLayer].indexOf(color) == -1){
      this.gfx.canvasLayerColors[selectedLayer].push(color);
    }
  }

  deleteColorFor(selectedLayer:string, color:string): void {
    this.gfx.canvasLayerColors[selectedLayer].splice(this.gfx.canvasLayerColors[selectedLayer].indexOf(color), 1);
  }

  filterColors(name: string) {
    return this.colors.filter(color =>
      color.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  selectedColor(event: MatAutocompleteSelectedEvent) {
    this.addColorFor(this.selectedLayer, event.option.value);
  }
  
}

@Component({
  selector: 'notes-dialog',
  templateUrl: 'notes-dialog.html',
  styleUrls: ['notes-dialog.css']
})
export class NotesDialog {

  constructor(
    public dialogRef: MatDialogRef<NotesDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
