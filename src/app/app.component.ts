import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

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
    return this.authSvc.userObject.type == 'B';
  }
  constructor(public authSvc:AuthService) {
    authSvc.authorize();
  }


  signout(){
    this.authSvc.logout();
    return false;
  }
}
