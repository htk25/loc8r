import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  constructor() { }

  public getPosition(cbSuccess, cbError, cbNoGeo):void{
    //If browser compatible with geolocation API
    //Note: if user disable the service, it's still not null.
    if(navigator.geolocation != null)
      navigator.geolocation.getCurrentPosition(cbSuccess,cbError);
    else
      cbNoGeo();
  }

}
