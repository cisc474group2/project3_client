import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Event, Geoloc } from '../../../assets/model';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsService } from 'src/app/services/events.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-postevent',
  templateUrl: './postevent.component.html',
  styleUrls: ['./postevent.component.scss']
})
export class PosteventComponent implements OnInit {

  get loggedIn():boolean{
    return this.authSvc.loggedIn;
  }

  submitted=false;
  loading =false;
  returnUrl: string;
  eventsForm: FormGroup;
  error: string;
  event: Event;

  constructor(public authSvc:AuthService, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private eventSvc: EventsService) { 
    authSvc.authorize();
  }

  ngOnInit(): void {
    this.eventsForm=this.formBuilder.group({
      title: '',
      description: '',
      eventApt: '',
      eventStreet: '',
      eventCity: '',
      eventState: '',
      eventZip: '',
      start_time: '',
      end_time: ''
    });
    this.returnUrl=this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  postEvent(){
    this.submitted == true;
    console.log(this.eventsForm)
    if (this.eventsForm.invalid) {
      return;
    }
    this.loading = true;
    
    this.eventSvc.postEvent(
      this.eventsForm.controls.title.value,
      this.eventsForm.controls.description.value,
      this.eventsForm.controls.eventStreet.value + "+" 
      + this.eventsForm.controls.eventApt.value + "+"
      + this.eventsForm.controls.eventCity.value + "+"
      + this.eventsForm.controls.eventState.value
      + "+" + this.eventsForm.controls.eventZip.value,
      this.eventsForm.controls.start_time.value,
      this.eventsForm.controls.end_time.value
      )
      .subscribe(response=>{
        this.router.navigate([this.returnUrl]);
      },err=>{this.submitted=false;this.loading=false;this.error=err.message||err;});
  }
 
}