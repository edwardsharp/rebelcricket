import { Component, OnInit, AfterContentInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';
import { MatSnackBar } from '@angular/material';

import { GfxService } from './gfx.service';
import { Gfx } from './gfx';

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

  gfx: Gfx;

  plate: {name: string, value: string};
  name: string = "New Plate";
  // plateControl = new FormControl();
  plateGroups = [
    {
      name: 'T-Shirt',
      plates: [
        { value: 'tshirt-m', viewValue: 'Medium T-Shirt' }
      ]
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

  // @ViewChild('c') c; 
  @ViewChild('orderDesignFile') orderDesignFile;

  canvasHeight: number;
  canvasWidth: number;
  plateObj: any;
  zoomVal: number = 0.5;
  panning: boolean = false;
  selecting: boolean = false;

  showRuler: boolean = true;

  constructor(
    private gfxService: GfxService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ){ }

  ngOnInit() {
    this.route.paramMap
      .switchMap((params: ParamMap) => this.gfxService.getGfx( params.get('id') ))
      .subscribe((gfx: Gfx) => {
        if(gfx && gfx._id && this.route.snapshot.params.id != 'new'){
          console.log('got gfx:',gfx);
          this.gfx = gfx;
        }else{
          this.gfx = new Gfx;
          console.log('new gfx:',gfx);
          this.router.navigate(['/dashboard/gfx/', this.gfx._id]);
          this.snackBar.open('New Gfx Created!', '', {
            duration: 2000,
          });          
        } 
      });
  }

  ngAfterContentInit() {

    /* PRINT SIZE'R 
     * ------------
     * a little utility to show image scale on real-world
     * itemz, like apparel (t-shirts, hats, etc.) or posters.
     * generally assuming print resolution of 300dpi. 
     *
     * 3dwardsharp
     */

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
    
    this.drawRulers();

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
    // var db = new PouchDB('gfx');

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
      this.plateObj.top = 60;
      this.plateObj.left = 60;

      this.plateObj.setCoords();

      this.canvas.add(this.plateObj);
      //canvas.setBackgroundImage(plateObj, canvas.renderAll.bind(canvas));
      //plateObj.center().setCoords();
      this.canvas.renderAll();

      console.log('loadSVG JSON.stringify(this.canvas):',JSON.stringify(this.canvas));
    });
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


  // removeImageFromCanvas(): void {
  // 	console.log('_removeImageFromCanvas idx:',this.canvas.getActiveObject());
  //   // this.canvas.item(this.$.removeImage.getAttribute('idx')).remove();
  //   this.canvas.getActiveObject().remove();
  //   // this.canvas.remove(obj);
  //   // this._asyncSaveCanvas();
  // }

  // onObjectSelected(e): void{
  //    this.objectToolsHidden = false;
  // }
  // onSelectionCleared(e): void{
  //   this.objectToolsHidden = true;
  //   // this._asyncSaveCanvas();
  // }
  // onObjectModified(e): void{
  //   e.target.opacity = 1;
  //   // this._asyncSaveCanvas();
  //   // console.log('CANVAS JSON, should match:',JSON.stringify(this.canvas), this.orderDesign.canvas);
  // }


  drawRulers(): void{

    var grid = 30; //e.g. DPI
    var width = 2600; // ~2x tshirtz 
    var measurementThickness = 60;
    var minorFontSize = 24;
    var majorFontSize = 26;

    this.canvas.add(new fabric.Rect({
      left: 0,
      top: 0,
      fill: '#DDD',
      selectable: false,
      width: measurementThickness,
      height: 2660
    }));

    this.canvas.add(new fabric.Rect({
      left: 0,
      top: 0,
      fill: '#DDD',
      width: 2660,
      selectable: false,
      height: measurementThickness
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
      this.canvas.add(new fabric.Line([location1, measurementThickness, location1, width], {
        stroke: isFoot ? '#888' : '#ccc',
        selectable: false
      }));

      // horizontal grid
      this.canvas.add(new fabric.Line([measurementThickness, location1, width, location1], {
        stroke: isFoot ? '#888' : '#ccc',
        selectable: false
      }));

      // left ruler
      this.canvas.add(new fabric.Line([measurementThickness - tickSize, location1, measurementThickness, location1], {
        stroke: '#888',
        selectable: false
      }));
      this.canvas.add(new fabric.Text(count.toString(), {
        left: measurementThickness - (tickSize * 2),
        top: location1,
        selectable: false,
        fontSize: minorFontSize,
        fontFamily: 'san-serif'
      }));

      if (isFoot) {
        footCount++;

        this.canvas.add(new fabric.Line([measurementThickness - tickSizeFoot, location1, measurementThickness, location1], {
          stroke: '#222',
          selectable: false
        }));
        this.canvas.add(new fabric.Text(footCount + "\'", {
          left: measurementThickness - (tickSizeFoot),
          top: location1 + 4,
          selectable: false,
          fontSize: majorFontSize,
          fontFamily: 'san-serif'
        }));
      }

      // top ruler
      this.canvas.add(new fabric.Line([location1, measurementThickness - tickSize, location1, measurementThickness], {
        stroke: '#888',
        selectable: false
      }));
      this.canvas.add(new fabric.Text(count.toString(), {
        left: location1 + 3,
        top: measurementThickness - (tickSize * 2) - 4,
        selectable: false,
        fontSize: minorFontSize,
        fontFamily: 'san-serif'
      }));

      if (isFoot) {
        this.canvas.add(new fabric.Line([location1, measurementThickness - tickSizeFoot, location1, measurementThickness], {
          stroke: '#222',
          selectable: false
        }));
        this.canvas.add(new fabric.Text(footCount + "\'", {
          left: location1 + 10,
          top: measurementThickness - (tickSizeFoot) - 7,
          selectable: false,
          fontSize: majorFontSize,
          fontFamily: 'san-serif'
        }));
      }

      count++
    } //for()

  } //drawRulers()



}
