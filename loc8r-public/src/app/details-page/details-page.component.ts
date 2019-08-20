import { Component, OnInit } from '@angular/core';
import { Loc8rDataService } from '../loc8r-data.service';
import { Location } from '../home-list/home-list.component';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-details-page',
  templateUrl: './details-page.component.html',
  styleUrls: ['./details-page.component.css']
})
export class DetailsPageComponent implements OnInit {

  constructor(private loc8rDataService: Loc8rDataService,
    private route: ActivatedRoute) { }


  ngOnInit():void {
    this.route.paramMap
      .pipe(
        //To get the locationId from URL parameter locationId
        switchMap( (params: ParamMap) => {
          let id = params.get('locationId');
          return this.loc8rDataService.getLocationsById(id);
        })
      )
      .subscribe( (newLocation: Location) =>{
        this.newLocation = newLocation;
        this.pageContent.header.title = newLocation.name;
        this.pageContent.sidebar= newLocation.name+' is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.\n\nI fyou\'ve been and you like it - or if you don\'t - please leave a review to help other people just like you.';
        //console.log(newLocation);
        //console.log(this.newLocation);
      });
    
  }

  public newLocation : Location;
  public pageContent = {
    header:{
      title: '',
      strapline: ''
    },
    sidebar:''
  };

}
