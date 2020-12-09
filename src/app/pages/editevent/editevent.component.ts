import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EventModel, Geoloc } from '../../../assets/model';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsService } from 'src/app/services/events.service';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-editevent',
  templateUrl: './editevent.component.html',
  styleUrls: ['./editevent.component.scss']
})
export class EditeventComponent implements OnInit {

  submitted=false;
  loading =false;
  returnUrl: string;
  eventsForm: FormGroup;
  error: string;
  event: EventModel;
  title: string;
  description: string;
  eventAddress: string[];
  start_time: string;
  end_time: string;

  constructor(public authSvc:AuthService, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private eventSvc: EventsService, private profileSvc: ProfileService) { 
    this.authSvc.authorize();
  }

  ngOnInit(): void {

    this.authSvc.CurrentUser.subscribe(user => {
      if (user === null || this.authSvc.userObject.type != 'B') {
        this.router.navigate(['login'])
      }
  });

    this.title = this.eventSvc.current_event.title;
    this.description = this.eventSvc.current_event.description;
    this.eventAddress = this.eventSvc.current_event.actual_address.split("+");
    this.start_time = this.eventSvc.current_event.start_time.toISOString().substring(0, 16);
    this.end_time = this.eventSvc.current_event.end_time.toISOString().substring(0, 16);
    
    //Authorize w/ Business accounts only

    
    this.eventsForm=this.formBuilder.group({
      title: ['',Validators.required],
      description: ['',Validators.required],
      eventApt: [''],
      eventStreet: ['',Validators.required],
      eventCity: ['',Validators.required],
      eventState: ['',Validators.required],
      eventZip: ['', [Validators.pattern('([0-9]{5}){1}(-[0-9]{4})?'),Validators.required]],
      start_time: ['',Validators.required],
      end_time: ['',Validators.required]
    });

    this.eventsForm.setValue({
      title: this.title,
      description: this.description,
      eventStreet: this.eventAddress[0],
      eventApt: this.eventAddress[1],
      eventCity: this.eventAddress[2],
      eventState: this.eventAddress[3],
      eventZip: this.eventAddress[4],
      start_time: this.start_time,
      end_time: this.end_time
    });

    this.returnUrl=this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  editEvent(){
    this.submitted == true;
    if (this.eventsForm.invalid) {
      return;
    }
    this.loading = true; 

    this.eventSvc.editEvent(
      this.eventsForm.controls.title.value,
      this.authSvc.userObject._id,
      this.eventsForm.controls.description.value,
      [],
      this.eventsForm.controls.eventStreet.value + "+" 
      + this.eventsForm.controls.eventApt.value + "+"
      + this.eventsForm.controls.eventCity.value + "+"
      + this.eventsForm.controls.eventState.value
      + "+" + this.eventsForm.controls.eventZip.value,
      this.eventsForm.controls.start_time.value,
      this.eventsForm.controls.end_time.value
      )
      .subscribe(response=>{
        this.eventSvc.getEventsFormat();
      },err=>{this.submitted=false;this.loading=false;this.error=err.message||err;});

      this.router.navigate(['home']);
      
  }
 
}