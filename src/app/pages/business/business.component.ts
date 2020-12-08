import { Component, OnInit } from '@angular/core';
import { EventModel, UserModel } from 'src/assets/model';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { EventsService } from '../../services/events.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.scss']
})
export class BusinessComponent implements OnInit {

  public selected_business_name:string;
  public selected_business_id:string;
  public cName : string;
  public cPhone : string;
  public email : string;  
  public mailAddress : string[];
  public hostedEvents : EventModel[];

  returnUrl : string;
  error : string;
  loading = false;
  submitted = false;
  notEditingProfile = true;
  
  checkingHostedEvents = false;

  constructor(private authSvc:AuthService, 
    private profileSvc:ProfileService, 
    private eventSvc:EventsService, 
    private router:Router, 
    private activatedRoute:ActivatedRoute) { 
      this.checkingHostedEvents = false;
      activatedRoute.paramMap.subscribe((params) => { 
        this.selected_business_id = params.get('_id'); 
        //console.log(this.selected_business_id);
        eventSvc.getBusiness(this.selected_business_id).subscribe((business:any) => {
          business = business.data;
          //console.log(business);
          this.selected_business_name = business.type_obj.bus_name;
          this.cName = business.type_obj.cName;
          this.cPhone = business.type_obj.cPhone;
          this.email = business.email;
          this.mailAddress = business.type_obj.mailAddress.split('+');
          eventSvc.getBulkEventsFormat(business.type_obj.hostedEvents)
          eventSvc.profile_business_event_list.subscribe((events:EventModel[]) => {
            //console.log(events);
            this.hostedEvents = events;
            this.checkingHostedEvents = true;
          });
        })
    });
  }

  ngOnInit(): void {
  }

  unregisterUser(event) {
    this.authSvc.authorize();
    if (this.authSvc.userObject.reg_events.includes(event._id)) {
        var index = this.authSvc.userObject.reg_events.indexOf(event._id);
        this.authSvc.userObject.reg_events.splice(index, 1);

        this.profileSvc.updateUser(this.authSvc.userObject._id, this.authSvc.userObject.email, this.authSvc.userObject.type_obj, this.authSvc.userObject.reg_events).subscribe(response => {
            console.log(response);
            // this.eventSvc.getEventsFormat();
            event.registered = !event.registered;
            event.registered_ind.length --;
            this.updateLists()
        }, err => {
            console.error(err);
        });


        this.eventSvc.deleteFromUserList(event._id, this.authSvc.userObject._id).subscribe(response => {
            console.log(response);
        }, err => {
            console.error(err);
        });
    }
}

editEvent(event : EventModel) {
    this.eventSvc.current_event = event;
    this.router.navigate(['editevent']);
}

registerUser(event) {
    this.authSvc.authorize();
    if (!this.authSvc.userObject.reg_events.includes(event._id)) {
        this.authSvc.userObject.reg_events.push(event._id);

        this.profileSvc.updateUser(this.authSvc.userObject._id, this.authSvc.userObject.email, this.authSvc.userObject.type_obj, this.authSvc.userObject.reg_events).subscribe(response => {
            console.log(response);
            // this.eventSvc.getEventsFormat();
            event.registered = !event.registered;
            event.registered_ind.length ++;
            this.updateLists()
        }, err => {
            console.error(err);
        });


        this.eventSvc.updateUserList(event._id, this.authSvc.userObject._id).subscribe(response => {
            console.log(response);
        }, err => {
            console.error(err);
        });
    }
}

currentBusiness(id : string): boolean {
    if (this.authSvc.userObject != null) {
        return id == this.authSvc.userObject._id;
    } else 
        return false;
    

}

updateLists(): void {
    this.eventSvc.getProfileEventList();
    if (this.authSvc.userObject.type === "B") 
        this.eventSvc.getProfileBusinessEventList();
    

}

}
