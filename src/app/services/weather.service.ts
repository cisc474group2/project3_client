import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserGeolocationService } from './user-geolocation.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private path = "http://localhost:3000/api/";
  private icon_path = 'http://openweathermap.org/img/wn/<<icon>>@2x.png';
  public curr_temp:BehaviorSubject<number> = new BehaviorSubject<number>(null);
  public high_temp:BehaviorSubject<number> = new BehaviorSubject<number>(null);
  public low_temp:BehaviorSubject<number> = new BehaviorSubject<number>(null);
  public feels_like:BehaviorSubject<number> = new BehaviorSubject<number>(null);
  public temp_insert:BehaviorSubject<string> = new BehaviorSubject<string>(null);
  public weather_code:BehaviorSubject<string> = new BehaviorSubject<string>(null);
  public selectedStandard = this.convertToF;

  constructor(private http:HttpClient) { }

  getWeather(lat:number, lng:number) {
    try {
      this.http.get(this.path + "other/weather/latlng/" + lat + '/' + lng).subscribe((res:Object) => {
          console.log(res);
          //@ts-ignore
          this.curr_temp.next(this.selectedStandard(res.data.main.temp));
          //@ts-ignore
          this.high_temp.next(this.selectedStandard(res.data.main.temp_max));
          //@ts-ignore
          this.low_temp.next(this.selectedStandard(res.data.main.temp_min));
          //@ts-ignore
          this.feels_like.next(this.selectedStandard(res.data.main.feels_like));
          //@ts-ignore
          this.weather_code.next(res.data.weather[0].icon);
          this.buildWeatherInsert();
        });     
    } catch(error) {
      console.log(error);
    }
  }

  buildWeatherInsert() {
    this.temp_insert.next(Math.trunc(this.curr_temp.value).toString().concat(String.fromCharCode(176) , 'F' 
      //, ' ', Math.trunc(this.high_temp.value).toString() 
      //, ' ',Math.trunc(this.low_temp.value).toString()
    ));
  }

  convertToF(temp_kelvin:number) {
    return (temp_kelvin - 273.15) * (9/5) + 32;
  }

  convertToC(temp_kelvin:number) {
    return (temp_kelvin - 273.15);
  }

  weatherImg(): string {
    return this.icon_path.replace('<<icon>>', this.weather_code.value);
  }
}
