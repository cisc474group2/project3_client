import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserGeolocationService } from 'src/app/services/user-geolocation.service';
import { Config } from '../../../assets/Config';
import { EventsService } from 'src/app/services/events.service';

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
  
  googleMapMarkerContainer:Array<GoogleMapMarker>;

  constructor(http:HttpClient, geolocService:UserGeolocationService, eventSvc:EventsService) {
    geolocService.lat.subscribe(res => {
      this.lat = geolocService.lat.value;
      this.lng = geolocService.lng.value;
      this.googleMapType = 'ROADMAP';
      this.zoom = 13;
      eventSvc.event_list.subscribe(events => {
        this.googleMapMarkerContainer = new Array<GoogleMapMarker>();
        events.forEach( event => {
          this.googleMapMarkerContainer.push(new GoogleMapMarker(event.event_geoloc.lat, event.event_geoloc.lng, event.title, event.description));
        });
        console.log("loaded all events into map");
      });

    })
  }
}

export class GoogleMapMarker {
  lat:number;
  lng:number;
  title:string;
  lable:string;

  public constructor(lat:number, lng:number, title:string, lable:string) {  
    this.lat = lat;
    this.lng = lng;
    this.title = title;
    this.lable = lable;
  }
}