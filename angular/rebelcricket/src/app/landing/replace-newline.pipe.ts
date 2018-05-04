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
@Pipe({name: 'replaceNewline'})
export class ReplaceNewlinePipe implements PipeTransform {
  transform(s: string): string {
    if(s && s.match(/\\n/)){
      return s.replace(/\\n/,'');
    }else{
      return s;
    }
  }
}
