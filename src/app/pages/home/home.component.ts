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
    // eventSvc.getEvents().subscribe(result=>{
    //   this.events_list=result.data;
    //   while(this.i < this.events_list.length){
    //     eventSvc.getBusiness(this.events_list[this.i].bus_id).subscribe(busResult=>{
    //       this.businessName = busResult.data.type_obj.bus_name;
    //       //this.events_list[this.i].bus_id = this.businessName;
    //     });
    //     this.i++;
    //   }
    // });
    this.authSvc.authorize();
  }

  ngOnInit(): void {
  }

  registerUser(event_id){
    this.authSvc.authorize();
    this.authSvc.userObject.reg_events.push(event_id);
    this.profileSvc.updateUser(this.authSvc.userObject._id, this.authSvc.userObject.email, 
      this.authSvc.userObject.type_obj, this.authSvc.userObject.reg_events).subscribe(response=>{
        console.log(response);
      },err=>{console.error(err);});
    
      this.eventSvc.updateUserList(event_id, this.authSvc.userObject._id).subscribe(response=>{
        console.log(response);
      },err=>{console.error(err);});
    }

}
