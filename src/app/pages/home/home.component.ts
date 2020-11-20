import { Component, OnInit } from '@angular/core';
import { EventsService } from 'src/app/services/events.service';
import { Event } from '../../../assets/model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  g:Array<Event>;
  events_list=[];
  businessName = '';
  i = 0;
  constructor(private eventSvc:EventsService) { 
    this.g = eventSvc.getEvetnsFormatedBusinessName();
    eventSvc.getEvents().subscribe(result=>{
      this.events_list=result.data;
      while(this.i < this.events_list.length){
        eventSvc.getBusiness(this.events_list[this.i].bus_id).subscribe(busResult=>{
          this.businessName = busResult.data.type_obj.bus_name;
          this.events_list[this.i].bus_id = this.businessName;
        });
        this.i++;
      }
    });
  
  }








// load everything at same time










  ngOnInit(): void {
  }

}
