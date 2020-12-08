import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EventModel, Geoloc } from 'src/assets/model';
import { Config } from '../secrets/Config';
import { Router } from '@angular/router';
import { WeatherService } from './weather.service';

@Injectable({
  providedIn: 'root'
})
export class UserGeolocationService {
  private path = "http://localhost:3000/api/";
  public lat: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  public lng: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  public accuracy: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  public userGeoloc: BehaviorSubject<Geoloc> = new BehaviorSubject<Geoloc>(null);
  public currentLocal: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  public currentAdministrativeAreaLevel1: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  private default_location:number[] = [-75.1653705, 39.9529923];
  constructor(private http: HttpClient, private router:Router, private weatherSvc:WeatherService) {
  }

  getLocation(): void{
    //console.log("asking for location");
    if (navigator.permissions.query({ name: 'geolocation' }).then(res => {return res.state === "granted"})) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.overrideGeolocLocation(position.coords.longitude, position.coords.latitude);
        this.accuracy.next(position.coords.accuracy);
        this.userGeoloc.next(new Geoloc(this.lng.value, this.lat.value));
        //console.log("resetting user location");
      }, (notAllowed) => {  //User blocks geolocation
        this.overrideGeolocLocation(this.default_location[0], this.default_location[1]);
        this.accuracy.next(-1);
        this.userGeoloc.next(new Geoloc(this.lng.value, this.lat.value));
        //console.log("resetting user location");
      });
    } else if (navigator.permissions.query({ name: 'geolocation' }).then(res => {return res.state === "denied"})) {
      //console.log("Request for Geolocation Denied");
      this.overrideGeolocLocation(this.default_location[0], this.default_location[1]);
      this.accuracy.next(-1);
    } else {
      //console.log("No Support for Geolocation");
      this.overrideGeolocLocation(this.default_location[0], this.default_location[1]);
      this.accuracy.next(null);
    }
  }

  overrideGeolocLocation(lng:number, lat:number):void {
    this.lng.next(lng);
    this.lat.next(lat);
    this.userGeoloc.next(new Geoloc(lng, lat));
    //console.log("geoloc override triggered!\n", this.userGeoloc.value);
    this.reverseGeocodeGetCityName();
    this.weatherSvc.getWeather(lat, lng);
  }

  
  reverseGeocodeGetCityName() {
    //this.router.navigate(['home']);
    let headerDict = {
      'Accept': 'type/javascript',
      // 'Access-Control-Allow-Headers': '*',
      // 'Access-Control-Allow-Origin': '*'
      // These are bad lines, very, very, bad lines
      //    They should feel bad.  They know what they did. 12/5/2020
    }
    let requestOptions = {
      headers: new HttpHeaders(headerDict)
    }
    try {
      this.http.get(this.path + "events/getTitleInfo/" + this.lat.value + '/' + this.lng.value).subscribe((res:Object) => {
          //console.log(res);
          //@ts-ignore
          this.currentAdministrativeAreaLevel1.next(res.data.results[0].address_components.filter((x) => {
            return x.types.includes('administrative_area_level_1');
          })[0].short_name);
          //@ts-ignore
          this.currentLocal.next(res.data.results[0].address_components.filter((x) => {
            return x.types.includes('locality');
          })[0].long_name);
        });     
    } catch(error) {
      console.log(error);
    }
  }
}
