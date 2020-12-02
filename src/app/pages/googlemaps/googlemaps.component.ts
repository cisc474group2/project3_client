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
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

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
  googleMapType:string
  loaded:boolean;
  
  googleMapMarkerContainer:Array<GoogleMapMarker>;
  g:Array<EventModel>;
  clicked;
  loggedIn = this.authSvc.loggedIn;


  constructor(http:HttpClient, geolocService:UserGeolocationService, eventSvc:EventsService, private eventServ:EventsService, private profileSvc:ProfileService, private authSvc:AuthService) {
    geolocService.lat.subscribe(res => {
      this.lat = geolocService.lat.value;
      this.lng = geolocService.lng.value;
      this.googleMapType = 'ROADMAP';
      this.zoom = 15;
      this.loaded = false;
      eventSvc.event_list.subscribe(events => {
        if (events != null) {
          this.googleMapMarkerContainer = new Array<GoogleMapMarker>();
          events.forEach( event => {
            this.googleMapMarkerContainer.push(new GoogleMapMarker(event.event_geoloc.lat, event.event_geoloc.lng, event.title, event.description, event._id));
          });
          this.loaded = true;
          console.log("loaded all events into map");
        }
        else {
          this.loaded = false;
          console.log("events_list == null");
        }
      });
    })
  }

    showEvent(_id){
      this.clicked = true;
      this.g = this.eventServ.getOneEventFormat(_id);
    }

    registerUser(event_id){
      this.authSvc.authorize();
      if(!this.authSvc.userObject.reg_events.includes(event_id)){
        this.authSvc.userObject.reg_events.push(event_id);
  
        this.profileSvc.updateUser(this.authSvc.userObject._id, this.authSvc.userObject.email, 
          this.authSvc.userObject.type_obj, this.authSvc.userObject.reg_events).subscribe(response=>{
            console.log(response);
          },err=>{console.error(err);});
        
          this.eventServ.updateUserList(event_id, this.authSvc.userObject._id).subscribe(response=>{
            console.log(response);
            this.g = this.eventServ.getOneEventFormat(event_id);
          },err=>{console.error(err);});
  
      }
    }
  
    unregisterUser(event_id){
      this.authSvc.authorize();
      if(this.authSvc.userObject.reg_events.includes(event_id)){
        var index = this.authSvc.userObject.reg_events.indexOf(event_id);
        this.authSvc.userObject.reg_events.splice(index, 1);
  
        this.profileSvc.updateUser(this.authSvc.userObject._id, this.authSvc.userObject.email, 
          this.authSvc.userObject.type_obj, this.authSvc.userObject.reg_events).subscribe(response=>{
            console.log(response);
          },err=>{console.error(err);});
        
          this.eventServ.deleteFromUserList(event_id, this.authSvc.userObject._id).subscribe(response=>{
            console.log(response);
            this.g = this.eventServ.getOneEventFormat(event_id);
          },err=>{console.error(err);});
  
      }
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