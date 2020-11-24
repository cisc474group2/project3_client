import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserGeolocationService } from 'src/app/services/user-geolocation.service';
//@ts-ignore
import { Config } from '../../../assets/Config';

@Component({
  selector: 'app-googlemaps',
  templateUrl: './googlemaps.component.html',
  styleUrls: ['./googlemaps.component.scss']
})
export class GooglemapsComponent {
  lat:number;
  lng:number;
  center: google.maps.LatLngLiteral;
  zoom:number;
  apiLoaded: Observable<boolean>;

  constructor(http:HttpClient, geolocService:UserGeolocationService) { 
    this.apiLoaded = http.jsonp('https://maps.googleapis.com/maps/api/js?key=<<API>>'.replace('<<API>>', Config.GOOGLE_API), 'callback')
        .pipe(
          map(() => true),
          catchError(() => of(false)),
        );

    this.lat = geolocService.lat;
    this.lng = geolocService.lng;
    this.center = {lat:geolocService.lat, lng:geolocService.lng};
    this.zoom = 12;
    console.log(this.center + ' ' + this.zoom);
  }

  moveMap(event: google.maps.MouseEvent) {
    this.center = (event.latLng.toJSON());
  }

  move(event: google.maps.MouseEvent) {
    this.lat = event.latLng.lat();
    this.lng = event.latLng.lng();
  }


}
