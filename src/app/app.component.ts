import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { UserGeolocationService } from './services/user-geolocation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsService } from './services/events.service';
import { Location, Appearance} from '@angular-material-extensions/google-maps-autocomplete';
import { UserModel, BusModel, IndModel } from '../assets/model';
import PlaceResult = google.maps.places.PlaceResult;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Community Board';
  public username:string = '';

  get loggedIn():boolean{
    return this.authSvc.loggedIn;
  }

  get business():boolean{
    if(this.authSvc.userObject!=undefined){
      return this.authSvc.userObject.type == 'B';
    }
    else{
      return false;
    }
  }
  constructor(public authSvc:AuthService, public geoloc:UserGeolocationService, private eventSvc:EventsService, private router: Router) {
    authSvc.authorize();
    geoloc.getLocation();

    authSvc.CurrentUser.subscribe((user:UserModel) => {
      if (user == null || user == undefined) {
        this.username = '';
      }
      else {
        if (user.type == "B") {
          //@ts-ignore
          this.username = user.type_obj.bus_name;
        } else if (user.type == "I") {
          //@ts-ignore
          this.username = user.type_obj.fName.concat(" ", user.type_obj.lName);
        }
      }
    });
  }


  signout(){
    this.authSvc.logout();
    this.router.navigate(['login']);
    return false;
  }
}
