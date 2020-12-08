import {Component, EventEmitter, OnInit} from '@angular/core';
import {EventsService} from 'src/app/services/events.service';
import {EventModel} from '../../../assets/model';
import {ProfileService} from 'src/app/services/profile.service';
import {AuthService} from 'src/app/services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {UserGeolocationService} from '../../services/user-geolocation.service';
import {Location, Appearance} from '@angular-material-extensions/google-maps-autocomplete';
import PlaceResult = google.maps.places.PlaceResult;
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatSelectChange} from '@angular/material/select';
import { WeatherService } from '../../services/weather.service';
import { MasterDateTimeService } from 'src/app/services/master-date-time.service';

@Component({selector: 'app-home', templateUrl: './home.component.html', styleUrls: ['./home.component.scss']})
export class HomeComponent implements OnInit {
    g : Array < EventModel >;
    public loggedIn = this.authSvc.loggedIn;
    public currentIndex = 0;
    public locality_name : string;
    public locality_state : string;
    public radius_options : number[];
    public date_insert:string;
    public temp_insert:string;
    public count = 0;
    default_radius = 50;
    labelText = "Change current location";

    constructor(private eventSvc : EventsService, 
      private profileSvc : ProfileService, 
      private authSvc : AuthService, 
      private route : ActivatedRoute, 
      private router : Router, 
      private geoloc : UserGeolocationService, 
      public dialog : MatDialog, 
      private weatherSvc:WeatherService, 
      private mstDateTimeSvc:MasterDateTimeService) {
        this.geoloc.currentLocal.subscribe(city => {
            this.locality_name = this.geoloc.currentLocal.value;
        });
        this.geoloc.currentAdministrativeAreaLevel1.subscribe(state => {
            this.locality_state = this.geoloc.currentAdministrativeAreaLevel1.value;
        });
        this.radius_options = [
            5,
            10,
            25,
            50,
            100,
            250
        ];
        weatherSvc.temp_insert.subscribe((t_i:string) => {
          this.temp_insert = t_i;
        });
        mstDateTimeSvc.date_insert.subscribe((d_i:string) => {
          this.date_insert = d_i;
        });
    }

    ngOnInit(): void {
        this.eventSvc.getEventsFormat();
        this.eventSvc.event_list.subscribe((event_list : Array < EventModel >) => {
            this.g = event_list;
        })
    }


    openDialog() {
      this.dialog.open(notLoggedIn, {});
    }


    registerUser(event) {
        this.authSvc.authorize();
        console.log(this.authSvc.userObject);
        if (this.authSvc.userObject === undefined || this.authSvc.userObject === null) {
            this.openDialog();
        } else {
            if (!this.authSvc.userObject.reg_events.includes(event._id)) {
                this.authSvc.userObject.reg_events.push(event._id);

                this.profileSvc.updateUser(this.authSvc.userObject._id, this.authSvc.userObject.email, this.authSvc.userObject.type_obj, this.authSvc.userObject.reg_events).subscribe(response => {
                    console.log(response);
                    // this.eventSvc.getEventsFormat();
                    event.registered = !event.registered;
                    event.registered_ind.length ++;
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

    currentBusiness(id : string): boolean {
        if (this.authSvc.userObject != null) {
            return id == this.authSvc.userObject._id;
        } else 
            return false;
        
    }

    editEvent(event : EventModel) {
        this.eventSvc.current_event = event;
        this.router.navigate(['editevent']);
    }

    eventsLoaded(): boolean {
        return this.eventSvc.events_loaded.value;
    }

    noEventsFound(): boolean {
        if(this.eventSvc.zero_events.value && this.count<=0){
            this.count = 1;
            this.dialog.open(noLocation);
        }

        
        return this.eventSvc.zero_events.value;
    }

    onAutocompleteSelected(result : PlaceResult) { // console.log('onAutocompleteSelected: ', result);
    }

    onLocationSelected(location : Location) {
        this.geoloc.overrideGeolocLocation(location.longitude, location.latitude);
        this.eventSvc.getEventsFormat();
        this.count = 0;
        console.log(this.geoloc.userGeoloc.value);
    }

    // Popular Events
    // Near Me
    // New Events
    // Right Now
    // My Events
    onTabSelectChange(tab : MatTabChangeEvent) { // console.log(tab);
        switch (tab.index) {
            case 0:
                this.currentIndex = 0;
                this.eventSvc.event_list.next(this.eventSvc.sortList(this.eventSvc.events_all.value, this.eventSvc.hotSort));
                break;
            case 1:
                this.currentIndex = 1;
                this.eventSvc.event_list.next(this.eventSvc.sortList(this.eventSvc.events_all.value, this.eventSvc.distanceSort));
                break;
            case 2:
                this.currentIndex = 2;
                this.eventSvc.event_list.next(this.eventSvc.sortList(this.eventSvc.events_all.value, this.eventSvc.upcommingSort));
                break;
            case 3:
                this.currentIndex = 3;
                this.eventSvc.event_list.next(this.eventSvc.sortList(this.eventSvc.nowFilter(this.eventSvc.events_all.value), this.eventSvc.nowSort));
                break;
            case 4:
                this.currentIndex = 4;
                break;
            default:
                this.eventSvc.event_list.next(this.eventSvc.sortList(this.eventSvc.event_list.value, this.eventSvc.alphaSort));
                break;
        }
    }

    onRadiusDropDownChange(dropdown : MatSelectChange) {
        this.eventSvc.user_radius.next(dropdown.value);
        this.eventSvc.getEventsFormat();
    }

    getWeatherPath():string {
        return this.weatherSvc.weatherImg();
    }


}

@Component({
  selector: 'notLoggedIn',
  templateUrl: 'notLoggedIn.html',
  styleUrls: ['./home.component.scss']
})
export class notLoggedIn{

  constructor(
    public dialogRef: MatDialogRef<notLoggedIn>, private router: Router){

    };

    redirectToLogin() {
      this.dialogRef.close();
      this.router.navigate(['login']);
  }

     redirectToRegister() {
      this.dialogRef.close();
      this.router.navigate(['register']);
  }

}

@Component({
    selector: 'noLocation',
    templateUrl: 'noLocation.html',
    styleUrls: ['./home.component.scss']
  })
  export class noLocation{
  
    constructor(
      public dialogRef: MatDialogRef<noLocation>){
  
      };
      
      searchAgain(){
          this.dialogRef.close();
      }
      
  
  }

