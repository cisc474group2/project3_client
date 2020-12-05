import { Component, EventEmitter, OnInit } from '@angular/core';
import { EventsService } from 'src/app/services/events.service';
import { EventModel } from '../../../assets/model';
import { ProfileService } from 'src/app/services/profile.service';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { UserGeolocationService } from '../../services/user-geolocation.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  g:Array<EventModel>;
  public loggedIn = this.authSvc.loggedIn;
  public currentIndex = 0;

  constructor(private eventSvc:EventsService, private profileSvc:ProfileService, private authSvc:AuthService, private route: ActivatedRoute, private router: Router) { 
    eventSvc.getEventsFormat();
    eventSvc.event_list.subscribe((event_list:Array<EventModel>) => {
      this.g = event_list;
    })
  }

  ngOnInit(): void {
  }

  registerUser(event){
    this.authSvc.authorize();
    if(!this.authSvc.userObject.reg_events.includes(event._id)){
      this.authSvc.userObject.reg_events.push(event._id);

        this.profileSvc.updateUser(this.authSvc.userObject._id, this.authSvc.userObject.email, 
          this.authSvc.userObject.type_obj, this.authSvc.userObject.reg_events).subscribe(response=>{
            console.log(response);
            //this.eventSvc.getEventsFormat();
            event.registered = !event.registered;
            event.registered_ind.length++;
          },err=>{console.error(err);});


          this.eventSvc.updateUserList(event._id, this.authSvc.userObject._id).subscribe(response=>{
            console.log(response);
          },err=>{console.error(err);});
    }
  }

  unregisterUser(event){
    this.authSvc.authorize();
    if(this.authSvc.userObject.reg_events.includes(event._id)){
      var index = this.authSvc.userObject.reg_events.indexOf(event._id);
      this.authSvc.userObject.reg_events.splice(index, 1);

      this.profileSvc.updateUser(this.authSvc.userObject._id, this.authSvc.userObject.email, 
        this.authSvc.userObject.type_obj, this.authSvc.userObject.reg_events).subscribe(response=>{
          console.log(response);
          //this.eventSvc.getEventsFormat();
          event.registered = !event.registered;
          event.registered_ind.length--;
        },err=>{console.error(err);});
      

        this.eventSvc.deleteFromUserList(event._id, this.authSvc.userObject._id).subscribe(response=>{
          console.log(response);
        },err=>{console.error(err);});
    }
  }

  currentBusiness(id: string):boolean{
    if(this.authSvc.userObject != null){
      return id == this.authSvc.userObject._id;
    }
    else return false;
  }

  editEvent(event: EventModel){
    this.eventSvc.current_event = event;
    this.router.navigate(['editevent']);
  }

  eventsLoaded():boolean {
    return this.eventSvc.events_loaded.value;
  }
  
  noEventsFound():boolean {
    return this.eventSvc.zero_events.value;
  }

  //Popular Events
  //Near Me
  //New Events
  //Right Now
  //My Events
  onTabSelectChange(tab:MatTabChangeEvent) {
    console.log(tab);
    switch (tab.index) {
      case 0:
        this.currentIndex = 0;
        this.eventSvc.event_list.next(this.eventSvc.sortList(this.eventSvc.event_list.value, this.eventSvc.hotSort));
        break;
      case 1:
        this.currentIndex = 1;
        this.eventSvc.event_list.next(this.eventSvc.sortList(this.eventSvc.event_list.value, this.eventSvc.distanceSort));
        break;
      case 2:
        this.currentIndex = 2;
        this.eventSvc.event_list.next(this.eventSvc.sortList(this.eventSvc.event_list.value, this.eventSvc.upcommingSort));
        break;
      case 3:
        this.currentIndex = 3;
        this.eventSvc.event_list.next(this.eventSvc.sortList(this.eventSvc.event_list.value, this.eventSvc.nowSort));
        break;
      case 4:
        this.currentIndex = 4;
        break;
      default:
        this.eventSvc.event_list.next(this.eventSvc.sortList(this.eventSvc.event_list.value, this.eventSvc.alphaSort));
        break;
      }
  }
}
