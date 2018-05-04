import { Pipe, PipeTransform } from '@angular/core';
/*
 * pretty print vendor filenames
 * takes an exponent argument that is a string
 * Usage:
 *   filename | sliceVendorFilename
 * Example:
 *   {{ '1481360436454-companycasuals-infant___toddler.json' | sliceVendorFileName }}
 *   formats to: 1024
*/
@Pipe({name: 'sliceVendorFilename'})
export class SliceVendorFilenamePipe implements PipeTransform {
  transform(filename: string): string {
  	let arr = [];
  	try{
  		arr.push(filename.split('___')[0].split('-')[1]);
  	}catch(e){ }
  	try{
  		arr.push(filename.split('___')[0].split('-')[2]);
  	}catch(e){ }
  	try{
  		arr.push(filename.split('___')[1].split('.')[0]);
  	}catch(e){ }

    return arr.join(' ').replace(/\./,'').replace(/json/i,'').replace(/_/g,' ');
  }
}

@Pipe({name: 'sliceVendorFilenameCategory'})
export class SliceVendorFilenameCategoryPipe implements PipeTransform {
  transform(filename: string): string {
  	let arr = [];
  	try{
  		arr.push(filename.split('___')[0].split('-')[2]);
  	}catch(e){ }
  	try{
  		arr.push(filename.split('___')[1].split('.')[0]);
  	}catch(e){ }

    return arr.join(' ').replace(/\./,'').replace(/json/i,'').replace(/_/g,' ');
  }
}

@Pipe({name: 'sliceVendorFilenameDate'})
export class SliceVendorFilenameDatePipe implements PipeTransform {
  transform(filename: string): Date {
  	try{
  		return new Date(parseInt(filename.split('___')[0].split('-')[0]));
  	}catch(e){ return new Date(); }
  }
}

@Pipe({name: 'inspectorPipe'})
export class InspectorPipe implements PipeTransform {
  transform(value: string): string {
  	console.log(value);
  	return value;
  }
}
