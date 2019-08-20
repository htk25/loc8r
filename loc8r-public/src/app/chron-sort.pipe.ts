import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'chronSort'
})
export class ChronSortPipe implements PipeTransform {

  transform(reviews: any[]): any[] {
    
    if(reviews==null)
      return null;

    return reviews.sort( (a,b)=>{
      return a.createdOn >= b.createdOn ? -1 : 1;
    });;
  }

}
