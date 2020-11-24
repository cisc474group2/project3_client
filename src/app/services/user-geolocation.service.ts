import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserGeolocationService {
  public lat: BehaviorSubject<number>;
  public lng: BehaviorSubject<number>;
  public accuracy: BehaviorSubject<number>;

  constructor() {
    
   }

  getLocation(): void{
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lng = new BehaviorSubject<number>(position.coords.longitude);
        this.lat = new BehaviorSubject<number>(position.coords.latitude);
        this.accuracy = new BehaviorSubject<number>(position.coords.accuracy);
      });
    } else {
      console.log("No Support for Geolocation");
      this.lng = new BehaviorSubject<number>(null);
      this.lat = new BehaviorSubject<number>(null);
      this.accuracy = new BehaviorSubject<number>(null);
    }
  }
}
