import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserGeolocationService } from 'src/app/services/user-geolocation.service';
//@ts-ignore
import { Config } from '../../../assets/Config';
import { EventsService } from 'src/app/services/events.service';
import { EventModel } from '../../../assets/model';
import { ProfileService } from 'src/app/services/profile.service';
import { AuthService } from 'src/app/services/auth.service';

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
  c:Array<EventModel>;

  constructor(http:HttpClient, geolocService:UserGeolocationService, eventSvc:EventsService, private eventServ:EventsService, private profileSvc:ProfileService, private authSvc:AuthService) {
    geolocService.lat.subscribe(res => {
      this.lat = geolocService.lat.value;
      this.lng = geolocService.lng.value;
      this.googleMapType = 'ROADMAP';
      this.zoom = 15;
      eventSvc.event_list.subscribe(events => {
        this.googleMapMarkerContainer = new Array<GoogleMapMarker>();
        events.forEach( event => {
          this.googleMapMarkerContainer.push(new GoogleMapMarker(event.event_geoloc.lat, event.event_geoloc.lng, event.title, event.description, event._id));
        });
        console.log("loaded all events into map");
      });
    })
    this.googleMapMarkerContainer.forEach(marker => {
      //marker.addEventListener("click", this.showEvent(marker._id));
    });
  }

  registerUser(event_id){
    this.authSvc.authorize();
    this.authSvc.userObject.reg_events.push(event_id);
    this.profileSvc.updateUser(this.authSvc.userObject._id, this.authSvc.userObject.email, 
      this.authSvc.userObject.type_obj, this.authSvc.userObject.reg_events).subscribe(response=>{
        console.log(response);
      },err=>{console.error(err);});
    
      this.eventServ.updateUserList(event_id, this.authSvc.userObject._id).subscribe(response=>{
        console.log(response);
      },err=>{console.error(err);});
    }

    showEvent(_id){
      this.c = this.eventServ.getOneEventFormat(_id);
      document.getElementById('card').removeAttribute("display");
    }
}

export class GoogleMapMarker{
  lat:number;
  lng:number;
  title:string;
  label:string;
  _id: string;

  public constructor(lat:number, lng:number, title:string, label:string, _id: string) {  
    this.lat = lat;
    this.lng = lng;
    this.title = title;
    this.label = label;
    this._id = _id;
  }
}