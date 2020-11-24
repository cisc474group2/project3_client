import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserGeolocationService } from 'src/app/services/user-geolocation.service';
import { Config } from '../../../assets/Config';

@Component({
  selector: 'app-googlemaps',
  templateUrl: './googlemaps.component.html',
  styleUrls: ['./googlemaps.component.scss']
})
export class GooglemapsComponent {
  lat:number;
  lng:number;
  //center: google.maps.LatLngLiteral;
  zoom:number;
  googleMapType:string;


  constructor(http:HttpClient, geolocService:UserGeolocationService) {
    if (geolocService.lat == undefined) {
      geolocService.getLocation();
    }
    this.lat = geolocService.lat;
    this.lng = geolocService.lng;
    //this.center = {lat:geolocService.lat, lng:geolocService.lng};
    this.googleMapType = 'ROADMAP';
    this.zoom = 12;
    //console.log(this.center + ' ' + this.zoom);
  }
 
}
