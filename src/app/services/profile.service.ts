import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { EventModel, Geoloc } from '../../assets/model';
import { ɵBrowserAnimationBuilder } from '@angular/platform-browser/animations';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private path="http://localhost:3000/api/"

  constructor(private http:HttpClient) {
  }

  // get user so we can display information
  // how we will get the information for the user for here I have not decided yet
  
  updateEventsList(userID: string, reg_events: string){
    return this.http.put(this.path + 'users/' + userID + "/registered", {reg_events: reg_events});
  }

}
