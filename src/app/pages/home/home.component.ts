import { Component, OnInit } from '@angular/core';
import { EventsService } from 'src/app/services/events.service';
import { EventModel } from '../../../assets/model';
import { ProfileService } from 'src/app/services/profile.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  g:Array<EventModel>;
  events_list=[];
  i = 0;
  loggedIn = this.authSvc.loggedIn;

  constructor(private eventSvc:EventsService, private profileSvc:ProfileService, private authSvc:AuthService) { 
    this.g = eventSvc.getEventsFormat();
  }

  ngOnInit(): void {
  }

  registerUser(event_id){
    this.authSvc.authorize();
    if(!this.authSvc.userObject.reg_events.includes(event_id)){
      this.authSvc.userObject.reg_events.push(event_id);

      this.profileSvc.updateUser(this.authSvc.userObject._id, this.authSvc.userObject.email, 
        this.authSvc.userObject.type_obj, this.authSvc.userObject.reg_events).subscribe(response=>{
          console.log(response);
        },err=>{console.error(err);});
      
        this.eventSvc.updateUserList(event_id, this.authSvc.userObject._id).subscribe(response=>{
          console.log(response);
          this.g = this.eventSvc.getEventsFormat();
        },err=>{console.error(err);});

    }
  }

  unregisterUser(event_id){
    this.authSvc.authorize();
    if(this.authSvc.userObject.reg_events.includes(event_id)){
      var index = this.authSvc.userObject.reg_events.indexOf(event_id);
      this.authSvc.userObject.reg_events.splice(index, 1);

      this.profileSvc.updateUser(this.authSvc.userObject._id, this.authSvc.userObject.email, 
        this.authSvc.userObject.type_obj, this.authSvc.userObject.reg_events).subscribe(response=>{
          console.log(response);
        },err=>{console.error(err);});
      
        this.eventSvc.deleteFromUserList(event_id, this.authSvc.userObject._id).subscribe(response=>{
          console.log(response);
          this.g = this.eventSvc.getEventsFormat();
        },err=>{console.error(err);});

    }
  }

}
