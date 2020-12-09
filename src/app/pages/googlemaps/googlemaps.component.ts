import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, range } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserGeolocationService } from 'src/app/services/user-geolocation.service';
//@ts-ignore
import { Config } from '../../../assets/Config';
import { EventsService } from 'src/app/services/events.service';
import { EventModel, Geoloc } from '../../../assets/model';
import { ProfileService } from 'src/app/services/profile.service';
import { AuthService } from 'src/app/services/auth.service';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { Location, Appearance} from '@angular-material-extensions/google-maps-autocomplete';
import { Router } from '@angular/router';
import PlaceResult = google.maps.places.PlaceResult;
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

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

  constructor(http:HttpClient, private geolocService:UserGeolocationService, private eventServ:EventsService, private profileSvc:ProfileService, private authSvc:AuthService, private router:Router, public dialog : MatDialog) {
    geolocService.lat.subscribe(res => {
      //console.log("changed location");
      this.lat = geolocService.lat.value;
      this.lng = geolocService.lng.value;
      this.googleMapType = 'ROADMAP';
      this.zoom = 15;
      this.loaded = false;
      eventServ.event_list.subscribe(events => {
        let map = new Map<string, number>();

        if (events != null) {
          this.googleMapMarkerContainer = new Array<GoogleMapMarker>();
          events.forEach( event => {

            if (map.get(GoogleMapMarker.eventLatLngtoString(event)) == undefined) {
              map.set(GoogleMapMarker.eventLatLngtoString(event), 1);
              this.googleMapMarkerContainer.push(new GoogleMapMarker(event.event_geoloc.lat, event.event_geoloc.lng, event.title, event.description, [event._id]));
            }
            else {
              map.set(GoogleMapMarker.eventLatLngtoString(event), map.get(GoogleMapMarker.eventLatLngtoString(event)) + 1);
              let gmm:GoogleMapMarker = this.googleMapMarkerContainer.filter((x:GoogleMapMarker) => {return GoogleMapMarker.fuzzyCompareBetweenTypes(x, event)})[0];
              gmm._id.push(event._id);
              gmm.label = "".concat(gmm._id.length.toString(), ' events at this location');
              gmm.title = gmm.label;
              //this.googleMapMarkerContainer.splice(this.googleMapMarkerContainer.findIndex((x:GoogleMapMarker) => {GoogleMapMarker.fuzzyCompareBetweenTypes(x, event);}), 1).push(gmm)
            }
            //this.googleMapMarkerContainer.push(new GoogleMapMarker(event.event_geoloc.lat, event.event_geoloc.lng, event.title, event.description, event._id));
          });
          this.loaded = true;
          //console.log("loaded all events into map");
        }
        else {
          this.loaded = false;
          //console.log("events_list == null");
        }
      });
    })
  }

    showEvent(_id:string[]){
      this.clicked = true;
      if (_id.length != 1) {
        this.g = this.eventServ.events_all.value.filter((x:EventModel) => {return _id.includes(x._id);});
      } else {
        this.g = this.eventServ.getOneEventFormat(_id);
      }
    }

    openDialog() {
      this.dialog.open(mapsNotLoggedIn, {});
    }

    registerUser(event){
      this.authSvc.authorize();
      if (this.authSvc.userObject === undefined || this.authSvc.userObject === null) {
        this.openDialog();
    }
    else{
      if(!this.authSvc.userObject.reg_events.includes(event._id)){
        this.authSvc.userObject.reg_events.push(event._id);
  
          this.profileSvc.updateUser(this.authSvc.userObject._id, this.authSvc.userObject.email, 
            this.authSvc.userObject.type_obj, this.authSvc.userObject.reg_events).subscribe(response=>{
              console.log(response);
              //this.eventSvc.getEventsFormat();
              event.registered = !event.registered;
              event.registered_ind.length++;
            },err=>{console.error(err);});
  
  
            this.eventServ.updateUserList(event._id, this.authSvc.userObject._id).subscribe(response=>{
              console.log(response);
            },err=>{console.error(err);});
      }
    }
  }
  
    unregisterUser(event){
      this.authSvc.authorize();
      if(this.authSvc.userObject.reg_events.includes(event._id)){
        var index = this.authSvc.userObject.reg_events.indexOf(event._id);
        this.authSvc.userObject.reg_events.splice(index, 1);
  
        this.profileSvc.updateUser(this.authSvc.userObject._id, this.authSvc.userObject.email, 
          this.authSvc.userObject.type_obj, this.authSvc.userObject.reg_events).subscribe(response=>{
            console.log(response);
            //this.eventSvc.getEventsFormat();
            event.registered = !event.registered;
            event.registered_ind.length--;
          },err=>{console.error(err);});
        
  
          this.eventServ.deleteFromUserList(event._id, this.authSvc.userObject._id).subscribe(response=>{
            console.log(response);
          },err=>{console.error(err);});
      }
    }

    // registerUser(event){
    //   this.authSvc.authorize();
    //   if(!this.authSvc.userObject.reg_events.includes(event._id)){
    //     this.authSvc.userObject.reg_events.push(event._id);
  
    //       this.profileSvc.updateUser(this.authSvc.userObject._id, this.authSvc.userObject.email, 
    //         this.authSvc.userObject.type_obj, this.authSvc.userObject.reg_events).subscribe(response=>{
    //           console.log(response);
    //           //this.eventSvc.getEventsFormat();
    //           event.registered = !event.registered;
    //           event.registered_ind.length++;
    //         },err=>{console.error(err);});
  
  
    //         this.eventSvc.updateUserList(event._id, this.authSvc.userObject._id).subscribe(response=>{
    //           console.log(response);
    //         },err=>{console.error(err);});
    //   }
    // }
  
    // unregisterUser(event){
    //   this.authSvc.authorize();
    //   if(this.authSvc.userObject.reg_events.includes(event._id)){
    //     var index = this.authSvc.userObject.reg_events.indexOf(event._id);
    //     this.authSvc.userObject.reg_events.splice(index, 1);
  
    //     this.profileSvc.updateUser(this.authSvc.userObject._id, this.authSvc.userObject.email, 
    //       this.authSvc.userObject.type_obj, this.authSvc.userObject.reg_events).subscribe(response=>{
    //         console.log(response);
    //         //this.eventSvc.getEventsFormat();
    //         event.registered = !event.registered;
    //         event.registered_ind.length--;
    //       },err=>{console.error(err);});
        
  
    //       this.eventSvc.deleteFromUserList(event._id, this.authSvc.userObject._id).subscribe(response=>{
    //         console.log(response);
    //       },err=>{console.error(err);});
    //   }
    // }
  
    currentBusiness(id: string):boolean{
      if(this.authSvc.userObject != null){
        return id == this.authSvc.userObject._id;
      }
      else return false;
    }
  
    editEvent(event: EventModel){
      this.eventServ.current_event = event;
      this.router.navigate(['editevent']);
    }


}

export class GoogleMapMarker{
  lat:number;
  lng:number;
  title:string;
  label:string;
  _id: string[];
  locString:string;

  public constructor(lat:number, lng:number, title:string, label:string, _id: string[]) {  
    this.lat = lat;
    this.lng = lng;
    this.locString = Math.trunc(lat * 10000).toString().concat(', ', Math.trunc(lng * 10000).toString());
    this.title = title;
    this.label = label;
    this._id = _id;
  }

  static fuzzyCompare(a:GoogleMapMarker, b:GoogleMapMarker) {
    return a.locString == b.locString;
  }

  static eventLatLngtoString(a:EventModel):string {
    return Math.trunc(a.event_geoloc.lat * 10000).toString().concat(', ', Math.trunc(a.event_geoloc.lng * 10000).toString());
  }

  static fuzzyCompareBetweenTypes(a:GoogleMapMarker, b:EventModel) {
    return a.locString == this.eventLatLngtoString(b);
  }

  

}

@Component({
  selector: 'mapsNotLoggedIn',
  templateUrl: 'mapsNotLoggedIn.html',
  styleUrls: ['./googlemaps.component.scss']
})
export class mapsNotLoggedIn{

  constructor(
    public dialogRef: MatDialogRef<mapsNotLoggedIn>, private router: Router){

    };

    redirectToLogin() {
      this.dialogRef.close();
      this.router.navigate(['login']);
  }

     redirectToRegister() {
      this.dialogRef.close();
      this.router.navigate(['register']);
  }

}