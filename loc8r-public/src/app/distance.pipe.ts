import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'distance'
})
export class DistancePipe implements PipeTransform {

  transform(distance: number): string {

    const isNumeric = function (n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    };
    if (distance && isNumeric(distance)) {
      let thisDistance = '0';
      let unit = 'mile';
      if (distance > 1) {
        thisDistance = distance.toFixed(1);
        unit = 'miles';
      } 
      else 
        thisDistance = Math.floor(distance).toString();
      
      return thisDistance + unit;
    } 
    else 
      return '?';
      



  }

}
