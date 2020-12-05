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
  public currentLocal: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor() {
  }

  getLocation(): void{
    console.log("asking for location");
    if (navigator.permissions.query({ name: 'geolocation' }).then(res => {return res.state === "granted"})) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lng.next(position.coords.longitude);
        this.lat.next(position.coords.latitude);
        this.accuracy.next(position.coords.accuracy);
        this.userGeoloc.next(new Geoloc(this.lng.value, this.lat.value));
        console.log("resetting user location");
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
    console.log("geoloc override triggered!\n", this.userGeoloc.value);
  }

  reverseGeocodeGetCityName(lng:number, lat:number):string {
    
  }
}
