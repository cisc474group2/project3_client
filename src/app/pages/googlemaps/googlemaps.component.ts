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
import PlaceResult = google.maps.places.PlaceResult;

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

  constructor(http:HttpClient, private geolocService:UserGeolocationService, private eventServ:EventsService, private profileSvc:ProfileService, private authSvc:AuthService) {
    geolocService.lat.subscribe(res => {
      //console.log("changed location");
      this.lat = geolocService.lat.value;
      this.lng = geolocService.lng.value;
      this.googleMapType = 'ROADMAP';
      this.zoom = 15;
      this.loaded = false;
      eventServ.event_list.subscribe(events => {
        let map = new Map<number[], number>();

        if (events != null) {
          this.googleMapMarkerContainer = new Array<GoogleMapMarker>();
          events.forEach( event => {
            // console.log(map.get([event.event_geoloc.lng, event.event_geoloc.lat]));
            // if (map.get([event.event_geoloc.lng, event.event_geoloc.lat]) === undefined) {
            //   map.set([event.event_geoloc.lng, event.event_geoloc.lat], 1);
            //   this.googleMapMarkerContainer.push(new GoogleMapMarker(event.event_geoloc.lat, event.event_geoloc.lng, event.title, event.description, [event._id]));
            // }
            // else {
            //   map.set([event.event_geoloc.lng, event.event_geoloc.lat], map.get([event.event_geoloc.lng, event.event_geoloc.lat]) + 1);
            //   let gmm:GoogleMapMarker = this.googleMapMarkerContainer.filter((x:GoogleMapMarker) => {return x.lat == event.event_geoloc.lat && x.lng == event.event_geoloc.lng;})[0];
            //   gmm._id.push(event._id);
            //   gmm.label = "".concat(gmm._id.length.toString(), ' events at this location');
            //   gmm.title = gmm.label;
            //   this.googleMapMarkerContainer.splice(this.googleMapMarkerContainer.findIndex((x:GoogleMapMarker) => {return x.lat == event.event_geoloc.lat && x.lng == event.event_geoloc.lng;}), 1).push(gmm)
            // }
            this.googleMapMarkerContainer.push(new GoogleMapMarker(event.event_geoloc.lat, event.event_geoloc.lng, event.title, event.description, event._id));
          });
          // let i = 0;
          // while (i < this.googleMapMarkerContainer.length) {
          //   console.log(this.googleMapMarkerContainer[4].lat - this.googleMapMarkerContainer[i].lat);
          //   i = i + 1;
          // }
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

    showEvent(_id){
      this.clicked = true;
      this.g = this.eventServ.getOneEventFormat(_id);
    }

    registerUser(event){
      this.authSvc.authorize();
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

    onAutocompleteSelected(result: PlaceResult) {
      console.log('onAutocompleteSelected: ', result);
    }
   
    onLocationSelected(location: Location) {
      this.geolocService.overrideGeolocLocation(location.longitude, location.latitude);
      this.eventServ.getEventsFormat();
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