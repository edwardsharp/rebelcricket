import { Component, OnInit, ViewChild } from '@angular/core';
import {FormControl} from '@angular/forms';

import { GfxService } from './gfx.service';
declare var fabric:any;
declare var initFabricFilters:any;
declare var PouchDB: any;

@Component({
  selector: 'app-gfx',
  templateUrl: './gfx.component.html',
  styleUrls: ['./gfx.component.css']
})
export class GfxComponent implements OnInit {


  pokemonControl = new FormControl();

  pokemonGroups = [
    {
      name: 'Grass',
      pokemon: [
        { value: 'bulbasaur-0', viewValue: 'Bulbasaur' },
        { value: 'oddish-1', viewValue: 'Oddish' },
        { value: 'bellsprout-2', viewValue: 'Bellsprout' }
      ]
    },
    {
      name: 'Water',
      pokemon: [
        { value: 'squirtle-3', viewValue: 'Squirtle' },
        { value: 'psyduck-4', viewValue: 'Psyduck' },
        { value: 'horsea-5', viewValue: 'Horsea' }
      ]
    },
    {
      name: 'Fire',
      disabled: true,
      pokemon: [
        { value: 'charmander-6', viewValue: 'Charmander' },
        { value: 'vulpix-7', viewValue: 'Vulpix' },
        { value: 'flareon-8', viewValue: 'Flareon' }
      ]
    },
    {
      name: 'Psychic',
      pokemon: [
        { value: 'mew-9', viewValue: 'Mew' },
        { value: 'mewtwo-10', viewValue: 'Mewtwo' },
      ]
    }
  ];

	gfx: string;
	style: {name: string, value: string};
	// gfxStyles: Array<{name: string, value: string}>;
	gfxStyles = [
		{name: 'Crew', value: 'crew'},
		{name: "Women's Crew", value: 'womens_crew'},
		{name: 'Hoodie', value: 'hoodie'},
		{name: 'Long Sleeve', value: 'longsleeve'},
		{name: 'Tank', value: 'tank'}
	];
	toggleDesign = false;
	toggleDesignTxt = 'Show Back';
	objectToolsHidden = true;

	canvas: any;
  @ViewChild('c') c; 
  @ViewChild('orderDesignFile') orderDesignFile;

  constructor(private gfxService: GfxService) { }

  ngOnInit() {
  	this.getGfx();


  	// console.log('designside:',this.designSide);
    // console.log('DESIGN this.orderDesign.canvas?', this.orderDesign.canvas);
    // this.canvas = new fabric.Canvas(this.c);

    // draw something
    // var rect = new fabric.Rect({
    //     top : 100,
    //     left : 100,
    //     width : 60,
    //     height : 70,
    //     fill : 'red'
    // });
    // this.canvas.add(rect);
    
    
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

  getGfx(): void {
  	this.gfxService.getGfx().then(gfx => {
    	this.gfx = gfx;
    }, err => {
    	console.log('o noz! gfxService.getGfx() err:',err);
    });
  }

  toggleDesignElementImg(): void {
  	this.toggleDesign = true;
  	this.toggleDesignTxt = 'Show Front';
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
