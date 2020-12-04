import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EventModel, Geoloc } from 'src/assets/model';

@Injectable({
  providedIn: 'root'
})
export class UserGeolocationService {
  public lat: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  public lng: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  public accuracy: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  public userGeoloc: BehaviorSubject<Geoloc> = new BehaviorSubject<Geoloc>(null);

  constructor() {
  }

  getLocation(): void{
    // navigator.permissions.query({ name: 'geolocation' }).then(res => { 
    //   console.log(res.state);
    //   if (res.state === "granted") {
    //     navigator.geolocation.getCurrentPosition((position) => {
    //       this.lng.next(position.coords.longitude);
    //       this.lat.next(position.coords.latitude);
    //       this.accuracy.next(position.coords.accuracy);
    //     });
    //   } 
    //   else if (res.state === "denied") {
    //     console.log("Request for Geolocation Denied");
    //     this.lng.next(null);
    //     this.lat.next(null);
    //     this.accuracy.next(-1);
    //   } 
    //   else {
    //     console.log("No Support for Geolocation");
    //     this.lng.next(null);
    //     this.lat.next(null);
    //     this.accuracy.next(null);
    //   }
    // });
    if (navigator.permissions.query({ name: 'geolocation' }).then(res => {return res.state === "granted"})) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lng.next(position.coords.longitude);
        this.lat.next(position.coords.latitude);
        this.accuracy.next(position.coords.accuracy);
        this.userGeoloc.next(new Geoloc(this.lng.value, this.lat.value));
      });
    } else if (navigator.permissions.query({ name: 'geolocation' }).then(res => {return res.state === "denied"})) {
      console.log("Request for Geolocation Denied");
      this.lng.next(null);
      this.lat.next(null);
      this.accuracy.next(-1);
    } else {
      console.log("No Support for Geolocation");
      this.lng.next(null);
      this.lat.next(null);
      this.accuracy.next(null);
    }
  }

  overrideGeolocLocation(lng:number, lat:number):void {
    this.lng.next(lng);
    this.lat.next(lat);
    this.userGeoloc.next(new Geoloc(lat, lng));
  }
}
