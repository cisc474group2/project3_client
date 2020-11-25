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
  constructor(private eventSvc:EventsService, private profileSvc:ProfileService, private authSvc:AuthService) { 
    this.g = eventSvc.getEventsFormattedBusinessName();
  }

  ngOnInit(): void {
  }

  registerUser(event_id){
    console.log(this.authSvc.CurrentUser.value);
    var user_id = this.authSvc.userObject._id;
    console.log(event_id);
    console.log(user_id);
    this.profileSvc.updateEventsList(user_id, event_id);
    this.eventSvc.updateUserList(event_id, user_id);
  }

}
