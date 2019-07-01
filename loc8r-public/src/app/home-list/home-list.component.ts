import { Component, OnInit } from '@angular/core';


export class Location{
  _id: string;
  name: string;
  distance: number;
  address: string;
  rating: number;
  facilities: string[];
}

@Component({
  selector: 'app-home-list',
  templateUrl: './home-list.component.html',
  styleUrls: ['./home-list.component.css']
})



export class HomeListComponent implements OnInit {

  constructor() { }
 
  
  // public locations: Location[];

  // private getLocations():void{
  //   this.loc8rDataService
  //     .getLocations()
  //       .then( (foundLocations) => this.locations = foundLocations );
  // }

  //This is very similar to C# onInit of a page/window
  ngOnInit() {
    // this.getLocations();
  }

}
