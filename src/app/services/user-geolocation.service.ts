import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserGeolocationService {
  public lat: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  public lng: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  public accuracy: BehaviorSubject<number> = new BehaviorSubject<number>(null);

  constructor() {
    
   }

  getLocation(): void{
    if (navigator.permissions.query({ name: 'geolocation' }).then(res => {return res.state === "granted"})) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lng.next(position.coords.longitude);
        this.lat.next(position.coords.latitude);
        this.accuracy.next(position.coords.accuracy);
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
}
