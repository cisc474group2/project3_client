import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { PosteventComponent } from './pages/postevent/postevent.component';
import { ProfileComponent } from './pages/profile/profile.component'
import { GooglemapsComponent } from './pages/googlemaps/googlemaps.component';
import { EditprofileComponent} from './pages/profile/edit/editprofile.component';
import { EditeventComponent} from './pages/editevent/editevent.component';
import { BusinessComponent } from './pages/business/business.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';

const routes: Routes = [
  {path:'',redirectTo:'home',pathMatch:'full'},
  {path:'home',component: HomeComponent},
  {path:'googlemaps', component: GooglemapsComponent},
  {path:'login',component: LoginComponent},
  {path:'register',component: RegisterComponent},
  {path:'postevent',component: PosteventComponent},
  {path:'profile', component: ProfileComponent},
  {path:'profile/edit', component: EditprofileComponent},
  {path:'editevent', component: EditeventComponent},
  {path:'business/:_id', component:BusinessComponent},
  {path:'about', component:AboutUsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
