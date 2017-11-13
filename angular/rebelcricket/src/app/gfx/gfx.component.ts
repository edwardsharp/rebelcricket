import { Component, AfterViewInit, ViewChild } from '@angular/core';
import {FormControl} from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';

import { GfxService } from './gfx.service';

import { fabric } from 'fabric';
// declare var fabric:any;
declare var initFabricFilters:any;
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
export class GfxComponent implements AfterViewInit {

  gfx: string;

  plate: {name: string, value: string};
  plateControl = new FormControl();
  plateGroups = [
    {
      name: 'T-Shirt',
      plates: [
        { value: 'tshirt-m', viewValue: 'Medium T-Shirt' }
      ]
    },
    {
      name: 'Hoodie',
      plates: [
        { value: 'hoodie-m', viewValue: 'Medium Hoodie' }
      ]
    },
    {
      name: 'Long Sleeve',
      disabled: false,
      plates: [
        { value: 'longsleeve-m', viewValue: 'Medium Long Sleeve' }
      ]
    },
    {
      name: 'Tank',
      plates: [
        { value: 'tank-m', viewValue: 'Medium Tank' }
      ]
    }
  ];

	objectToolsHidden = true;

	canvas: any;
  // @ViewChild('c') c; 
  @ViewChild('orderDesignFile') orderDesignFile;

  canvasHeight: number;
  canvasWidth: number;
  plateObj: any;
  zoomVal: number = 0.5;
  panning: boolean = false;
  selecting: boolean = false;

  model: string;
  modelChanged: Subject<string> = new Subject<string>();

  constructor(private gfxService: GfxService) { 
    Observable.fromEvent(window, 'resize')
      .debounceTime(500)
      .subscribe((event) => {
        this.resizeCanvas(event);
      });
  }


  ngAfterViewInit() {

    /* PRINT SIZE'R 
     * ------------
     * a little utility to show image scale on real-world
     * itemz, like apparel (t-shirts, hats, etc.) or posters.
     * generally assuming print resolution of 300dpi. 
     *
     * 3dwardsharp
     */

    this.canvas = new fabric.Canvas('c', {
      'selection': false
    });
    

    // addWheelListener(document, e => {
    //   // mouse wheel event
    //   this.canvas.relativePan(new fabric.Point(-e.deltaX, -e.deltaY));
    // });


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

    this.canvas.on('object:selected', e => {
      console.log('object selected! e',e);
      this.selecting = true;
    });
    this.canvas.on('selection:cleared', e => {
      console.log('object selection:cleared e:',e);
      this.selecting = false;
    });


    this.resizeCanvas('');
    this.canvas.setZoom(0.5);


  	this.getGfx();


  	// console.log('designside:',this.designSide);
    // console.log('DESIGN this.orderDesign.canvas?', this.orderDesign.canvas);
    // this.canvas = new fabric.Canvas(this.c);

    
    // canvasNeedsInit = true;
    // this._loadCanvas();

    // initFabricFilters(this);

    // this.canvas.on({
    //  'object:moving': function(e) {       
    //     e.target.opacity = 0.5;
    //     //snap to edge of canvas #TODO: look up canvas height/width
    //     if(e.target.top > -5 && e.target.top < 5){
    //       e.target.set({
    //         top: 0,
    //       });
    //     }
    //     if(e.target.right > 195 && e.target.right < 205){
    //       e.target.set({
    //         right: 200,
    //       });
    //     }
    //     if(e.target.bottom > 395 && e.target.bottom < 405){
    //       e.target.set({
    //         bottom: 400,
    //       });
    //     }
    //     if(e.target.left > -5 && e.target.left < 5){
    //       e.target.set({
    //         left: 0,
    //       });
    //     }

    //   },
    //  //very important, need to bind to this scope...
    //  'object:modified': this.onObjectModified.bind(this),
    //  'object:selected': this.onObjectSelected.bind(this),
    //  'selection:cleared': this.onSelectionCleared.bind(this)
    // });

    //file upload
    var db = new PouchDB('order_designs');

    // var _this = this;
    // this.orderDesignFile.addEventListener('change', function () {
    //   var file = this.orderDesignFile.files[0]; // file is a Blob

    //   // db.putAttachment(_this.designID+'_'+_this.designSide, file.name, file, file.type).then(function (result) {
    //   //   // handle result
    //   //   //_this._addImageToCanvas('order_designs/'+_this.designID+'_'+_this.designSide+'/'+file.name);
    //   // }).catch(function (err) {
    //   //   console.log(err);
    //   // });

    // });

  }

  resizeCanvas(event): void {

    try{
      this.canvasHeight = document.documentElement.clientHeight - 64;
      this.canvasWidth = document.documentElement.clientWidth;
      this.canvas.setWidth(this.canvasWidth);
      this.canvas.setHeight(this.canvasHeight);
      console.log('gonna try to resizeCanvas w:',this.canvasWidth,' h:',this.canvasHeight);
    }catch(e){
      console.log('o noz! caught e in resizeCanvas e:',e);
    }
  }

  plateChange(plate): void{
    if(plate && plate != '' && plate.length > 2){
      this.loadSVG(plate);
    }
  }

  loadSVG(id):void {
    
    // var elem = document.getElementById(id),
    //   svgStr = elem.innerHTML;
    // console.log('gonna loadSVG id:',id,' elem:',elem,' svgStr:',svgStr);  
    
    fabric.loadSVGFromURL(`/assets/gfx/${id}.svg`, (objects, options) => {
      // load svg data into a group elem
      // console.log('uh, fabric?',fabric);
      this.plateObj = fabric.util.groupSVGElements(objects, options);
      // this.plateObj.set('sourcePath', elem.getAttribute('data-url'));
      this.plateObj.selectable = false;
      this.plateObj.scaleX = 0.1;
      this.plateObj.scaleY = 0.1;
     
      this.plateObj.setCoords();

      this.canvas.add(this.plateObj);
      //canvas.setBackgroundImage(plateObj, canvas.renderAll.bind(canvas));
      //plateObj.center().setCoords();
      this.canvas.renderAll();

      console.log('loadSVG JSON.stringify(this.canvas):',JSON.stringify(this.canvas));
    });
  }

  drawSomething(): void{
    // draw something
    var rect = new fabric.Rect({
        top: 100,
        left: 100,
        width: 60,
        height: 70,
        fill: 'red',
        lockUniScaling: true
    });
    this.canvas.add(rect);
  }

  zoom(e): void {
    console.log('zoom e.value:',e.value);
    this.canvas.setZoom(e.value);
  }

  zoomReset(e): void {
    console.log('zoom reset!');
    this.zoomVal = 0.5;
    this.canvas.setZoom(0.5);
    this.canvas.absolutePan(new fabric.Point(0, 0));
  }

  getGfx(): void {
  	this.gfxService.getGfx().then(gfx => {
    	this.gfx = gfx;
    }, err => {
    	console.log('o noz! gfxService.getGfx() err:',err);
    });
  }

  removeImageFromCanvas(): void {
  	console.log('_removeImageFromCanvas idx:',this.canvas.getActiveObject());
    // this.canvas.item(this.$.removeImage.getAttribute('idx')).remove();
    this.canvas.getActiveObject().remove();
    // this.canvas.remove(obj);
    // this._asyncSaveCanvas();
  }

  onObjectSelected(e): void{
     this.objectToolsHidden = false;
  }
  onSelectionCleared(e): void{
    this.objectToolsHidden = true;
    // this._asyncSaveCanvas();
  }
  onObjectModified(e): void{
    e.target.opacity = 1;
    // this._asyncSaveCanvas();
    // console.log('CANVAS JSON, should match:',JSON.stringify(this.canvas), this.orderDesign.canvas);
  }


}
