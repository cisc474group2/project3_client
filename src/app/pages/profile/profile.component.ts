import { getInterpolationArgsLength } from '@angular/compiler/src/render3/view/util';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileService} from 'src/app/services/profile.service';
import { EventsService } from 'src/app/services/events.service';
import { EventModel } from '../../../assets/model';
import { BusModel, Geoloc, IndModel } from '../../../assets/model';
import { title } from 'process';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  
  returnUrl: string;
  error: string;
  loading = false;
  submitted = false;
  notEditingProfile = true;
  email: string;
  reg_events;
  fName: string;
  lName: string;
  busName: string;
  cName: string;
  cPhone: string;
  mailAddress:string[];
  hostedEvents: EventModel[];
  showIfIndividual = false;
  showIfBusiness = false;
  checkingRegisteredEvents = true;
  checkingHostedEvents = false;

  constructor(private formBuilder: FormBuilder,private route: ActivatedRoute,private router: Router,private authSvc:AuthService, private profileSvc: ProfileService, private eventSvc:EventsService) {
    this.authSvc.authorize();
   
    if(this.authSvc.userObject.type == 'I'){
      this.fName = this.authSvc.userObject.type_obj.fName;
      this.lName = this.authSvc.userObject.type_obj.lName;
    }
    else{
      this.busName = this.authSvc.userObject.type_obj.bus_name;
      this.cName = this.authSvc.userObject.type_obj.cName;
      this.cPhone = this.authSvc.userObject.type_obj.cPhone;
      this.mailAddress = this.authSvc.userObject.type_obj.mailAddress.split('+');
      for(let i=0;i<this.mailAddress.length;i++){
        if(this.mailAddress[i]==""){
          this.mailAddress.splice(i,1);
        }
        this.mailAddress[i]=" "+this.mailAddress[i];
      }
      this.hostedEvents = this.authSvc.userObject.type_obj.hostedEvents;
    }
    
  }

   getFormattedEvents(): EventModel[]{
    let event_model_list = Array<EventModel>();
    this.eventSvc.getBulkEvents().subscribe(response=>{
      response.data.forEach(event=>{
      this.eventSvc.getBusiness(event.bus_id).subscribe(business => {
        //console.log(event);
        event_model_list.push(new EventModel(event.title,
          event.description,
          this.eventSvc.formatAddress(event.event_address),
          new Date(event.start_time),
          new Date(event.end_time),
          event._id,
          business.data.type_obj.bus_name,
          event.registered_ind,
          event.event_geoloc,
          event.create_date,
          (this.authSvc.userObject!=null)?this.authSvc.userObject.reg_events.includes(event._id):false ,
          this.eventSvc.convertTimestamp(event.start_time),
          this.eventSvc.convertTimestamp(event.end_time),
          business.data._id,
          event.event_address));
    })
  })});
  return event_model_list;
   }

   getFormattedHostEvents():EventModel[]{
    let event_model_list = Array<EventModel>();
    this.eventSvc.getBulkBusinessEvents().subscribe(response=>{
      response.data.forEach(event=>{
      this.eventSvc.getBusiness(event.bus_id).subscribe(business => {
        //console.log(event);
        event_model_list.push(new EventModel(event.title,
          event.description,
          this.eventSvc.formatAddress(event.event_address),
          new Date(event.start_time),
          new Date(event.end_time),
          event._id,
          business.data.type_obj.bus_name,
          event.registered_ind,
          event.event_geoloc,
          event.create_date,
          (this.authSvc.userObject!=null)?this.authSvc.userObject.reg_events.includes(event._id):false ,
          this.eventSvc.convertTimestamp(event.start_time),
          this.eventSvc.convertTimestamp(event.end_time),
          business.data._id,
          event.event_address));
    })
  })});
  return event_model_list;
   }

  ngOnInit(): void {
    this.authSvc.CurrentUser.subscribe(user => {
      if (user === null) {
        this.router.navigate(['login'])
      }
      else{
        this.email = this.authSvc.userObject.email;
        this.reg_events = this.getFormattedEvents();

        if(this.authSvc.userObject.type == 'I'){
          this.showIfIndividual = true;
          this.showIfBusiness = false;
        }
        else{
          this.hostedEvents = this.getFormattedHostEvents();
          this.showIfBusiness = true;
          this.showIfIndividual = false;
        }
      }
  });

    
    this.returnUrl=this.route.snapshot.queryParams['returnUrl'] || '/';
}
  
  editProfile(){
    this.router.navigate(['profile/edit']);
  }

  onTabSelectChange(tab:MatTabChangeEvent) {
    switch (tab.index) {
    case 0:
      this.checkingHostedEvents = false;
      this.checkingRegisteredEvents = true;
      break;
    case 1:
      this.checkingHostedEvents = true;
      this.checkingRegisteredEvents = false;
      break;
    } 

  }
}
