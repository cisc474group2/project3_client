import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Event, Geoloc } from '../../../assets/model';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsService } from 'src/app/services/events.service';

@Component({
  selector: 'app-postevent',
  templateUrl: './postevent.component.html',
  styleUrls: ['./postevent.component.scss']
})
export class PosteventComponent implements OnInit {

  submitted=false;
  loading =false;
  returnUrl: string;
  eventsForm: FormGroup;
  error: string;
  event: Event;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private eventSvc: EventsService) { }

  ngOnInit(): void {
    this.eventsForm=this.formBuilder.group({
      title: '',
      description: '',
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
    this.eventsForm.controls.title.value,
    this.eventsForm.controls.description.value,
    new Geoloc(0, 0),
    this.eventsForm.controls.eventStreet.value

    this.eventSvc.postEvent(
      this.eventsForm.controls.title.value,
      this.eventsForm.controls.description.value,
      new Geoloc(0,0),
      this.eventsForm.controls.start_time.value,
      this.eventsForm.controls.end_time.value
      )
      .subscribe(response=>{
        this.router.navigate([this.returnUrl]);
      },err=>{this.submitted=false;this.loading=false;this.error=err.message||err;});
  }
 
}