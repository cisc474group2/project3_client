import { EventListenerFocusTrapInertStrategy } from '@angular/cdk/a11y';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { EventModel } from '../../assets/model'
import { throwIfEmpty } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserGeolocationService {
  public lat:number;
  public lng:number;
  public accuracy:number;
  public event_list:Array<EventModel>;

  constructor(private http:HttpClient) {
    this.event_list = new Array<EventModel>();
   }

  getLocation(): void{
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lng = position.coords.longitude;
        this.lat = position.coords.latitude;
        this.accuracy = position.coords.accuracy;
        console.log(this.lat + ' ' + this.lng);
      });
    } else {
      console.log("No Support for Geolocation");
    }
  }

  // getEvents():void {
  //   this.http.get<any>('localhost:3000/api/events/geo/loc/<lng>,<lat>/100'.replace('<lng>', this.lng.toString()).replace('<lat>', this.lat.toString()))
  //         .pipe(map(event=>{
  //           this.event_list.push(new EventModel(event.tile,
  //             event.description,
  //             event.event_address,
  //             event.start_time,
  //             event.end_time,
  //             event.bus_id,
  //             event.registered_ind,
  //             event.event_geoloc,
  //             event.create_date));
  //             console.log(event);
  //         }),catchError(err=>{this.event_list = null; return err.message||'server error'}));
  //     console.log(this.event_list);
  // }
}
