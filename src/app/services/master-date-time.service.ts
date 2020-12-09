import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MasterDateTimeService {
  public day:number;
  public day_of_week:string;
  public month:number;
  public month_string:string;
  public year:number;
  public date_insert:BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor() {
    let now = new Date();
    this.day = now.getDate();
    this.setDayOfWeek(now.getDay());
    this.month = now.getMonth();
    this.setMonth(this.month);
    this.year = now.getFullYear();
    this.buildDateInsert();
  }

  buildDateInsert() {
    this.date_insert.next(this.day_of_week.concat(', ', this.month_string, ' ', this.day.toString(), ', ', this.year.toString()));
  }

  setMonth(x: number):void {
    switch(x){
      case 0:
        this.month_string = "January";
        break;
        case 1:
        this.month_string = "Febuary";
        break;
        case 2:
        this.month_string = "March";
        break;
        case 3:
        this.month_string = "April";
        break;
        case 4:
        this.month_string = "May";
        break;
        case 5:
        this.month_string = "June";
        break;
        case 6:
        this.month_string = "July";
        break;
        case 7:
        this.month_string = "August";
        break;
        case 8:
        this.month_string = "September";
        break;
        case 9:
        this.month_string = "October";
        break;
        case 10:
        this.month_string = "November";
        break;
        case 11:
        this.month_string = "December";
        break;
    }
  }

  setDayOfWeek(x:number):void {
    switch(x){
      case 0:
        this.day_of_week = "Sunday";
        break;
        case 1:
        this.day_of_week = "Monday";
        break;
        case 2:
        this.day_of_week = "Tuesday";
        break;
        case 3:
        this.day_of_week = "Wednesday";
        break;
        case 4:
        this.day_of_week = "Thursday";
        break;
        case 5:
        this.day_of_week = "Friday";
        break;
        case 6:
        this.day_of_week = "Saturday";
        break;
    }
  }
}
