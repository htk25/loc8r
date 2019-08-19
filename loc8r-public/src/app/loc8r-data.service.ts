import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Location } from './home-list/home-list.component';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Loc8rDataService {

  constructor(private http:HttpClient) { }

  private apiBaseUrl = 'http://localhost:3000/api';

  public getLocations(lat: number, lng: number): Promise<Location[]> {
    if(environment.production)
      this.apiBaseUrl = 'https://loc8r4.herokuapp.com/api';

    

    const maxDistance: number = 10000;
    const url: string = `${this.apiBaseUrl}/locations?lng=${lng}&lat=${lat}&maxDistance=${maxDistance}`;

    return this.http
      .get(url)
      .toPromise()
      .then(response => response as Location[])
      .catch(this.handleError);
  }

  public getLocationsById(locationId: string): Promise<Location> {
    if(environment.production)
      this.apiBaseUrl = 'https://loc8r4.herokuapp.com/api';

    

    const url: string = `${this.apiBaseUrl}/locations/${locationId}`;

    return this.http
      .get(url)
      .toPromise()
      .then(response => response as Location)
      .catch(this.handleError);
  }  

  private handleError(error:any): Promise<any>{
    console.error('Something has gone wrong', error);
    return Promise.reject(error.message || error);
  }

}
