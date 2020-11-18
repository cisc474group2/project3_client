import { Component, OnInit } from '@angular/core';
import { EventsService } from 'src/app/services/events.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  events_list=[];
  constructor(private projSvc:EventsService) { 
    projSvc.getEvents().subscribe(result=>{
      this.events_list=result.data;
    })
  }

  ngOnInit(): void {
  }

}
