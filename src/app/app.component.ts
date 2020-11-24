import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { UserGeolocationService } from './services/user-geolocation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Community Board';
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
  constructor(public authSvc:AuthService, public geoloc:UserGeolocationService) {
    authSvc.authorize();
    geoloc.getLocation();
  }


  signout(){
    this.authSvc.logout();
    return false;
  }
}
