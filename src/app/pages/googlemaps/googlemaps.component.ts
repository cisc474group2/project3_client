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
  g:Array<EventModel>;
  c:Array<EventModel>;

  constructor(http:HttpClient, geolocService:UserGeolocationService, private eventSvc:EventsService, private profileSvc:ProfileService, private authSvc:AuthService) {
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
    this.g = eventSvc.getEventsFormat();
  }

  registerUser(event_id){
    this.authSvc.authorize();
    this.authSvc.userObject.reg_events.push(event_id);
    this.profileSvc.updateUser(this.authSvc.userObject._id, this.authSvc.userObject.email, 
      this.authSvc.userObject.type_obj, this.authSvc.userObject.reg_events).subscribe(response=>{
        console.log(response);
      },err=>{console.error(err);});
    
      this.eventSvc.updateUserList(event_id, this.authSvc.userObject._id).subscribe(response=>{
        console.log(response);
      },err=>{console.error(err);});
    }

    showEvent(_id){
      //this.g = this.eventSvc.getOneEventFormat(_id);
      this.g.forEach(result =>{
        if(result._id == _id){
          this.c.push(result);
        }
      });
      document.getElementById('event-card').setAttribute("display", "block");
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