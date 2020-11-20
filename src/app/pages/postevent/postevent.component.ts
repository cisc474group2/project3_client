import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Event, Geoloc } from '../../../assets/model';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-postevent',
  templateUrl: './postevent.component.html',
  styleUrls: ['./postevent.component.scss']
})
export class PosteventComponent implements OnInit {

  submitted=false;
  returnUrl: string;
  eventsForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, public authService:AuthService, public rerouter:Router) { }

  ngOnInit(): void {
    this.authService.CurrentUser.subscribe(user => {
        if (user === null) {
          this.rerouter.navigate(['login'])
        }
    })
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
    new Geoloc(0, 0),
    this.eventsForm.controls.eventStreet.value
  }
}