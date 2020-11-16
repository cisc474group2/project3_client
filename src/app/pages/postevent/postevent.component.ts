import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Event, Geoloc } from '../../../assets/model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-postevent',
  templateUrl: './postevent.component.html',
  styleUrls: ['./postevent.component.scss']
})
export class PosteventComponent implements OnInit {

  submitted=false;
  returnUrl: string;
  eventsForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.eventsForm=this.formBuilder.group({
      title: '',
      description: '',
      event_address: '',
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
    this.eventsForm.controls.title.value,
    this.eventsForm.controls.description.value,
    new Geoloc(this.eventsForm.controls.eventStreet.value + "+" 
    + this.eventsForm.controls.eventCity.value + "+"
    + this.eventsForm.controls.eventState.value
    //+ "+" + this.eventsForm.controls.eventZip.value
    ),
    this.eventsForm.controls.eventStreet.value
  }
}