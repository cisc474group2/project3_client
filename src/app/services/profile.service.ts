import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { EventModel, Geoloc } from '../../assets/model';
import { ɵBrowserAnimationBuilder } from '@angular/platform-browser/animations';
import { UserModel, BusModel, IndModel} from "../../assets/model";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private path="http://localhost:3000/api/"

  constructor(private http:HttpClient) {
  }


  updateUser(userID: string, email:string, type_obj: IndModel | BusModel, reg_events:string[]){
    return this.http.put(this.path+'users' + "/" + userID, {email:email, type_obj: type_obj, reg_events: reg_events});
  }
  
  updateEventsList(userID: string, new_event: string){
    var x = this.path + 'users' + "/" + userID + "/" + 'registered';
    console.log(x);
    return this.http.put(this.path + 'users' + "/" + userID + "/" + 'registered', {reg_events: new_event});
  }

}
