import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';

import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './pages/material/material-module'
import { AppComponent } from './app.component';
import { HomeComponent, notLoggedIn, noLocation } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { UserGeolocationService } from './services/user-geolocation.service'
import { PosteventComponent } from './pages/postevent/postevent.component';
import { ProfileComponent } from './pages/profile/profile.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { fromEventPattern } from 'rxjs';
import { GooglemapsComponent, mapsNotLoggedIn } from './pages/googlemaps/googlemaps.component';
import { AgmCoreModule } from '@agm/core';
import { MatGoogleMapsAutocompleteModule } from '@angular-material-extensions/google-maps-autocomplete';
import { Config } from 'src/app/secrets/Config';
import { EditprofileComponent } from './pages/profile/edit/editprofile.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { EditeventComponent } from './pages/editevent/editevent.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NoEventsLandingComponent } from './pages/no-events-landing/no-events-landing.component';
import { MatInputModule } from '@angular/material/input';
import { FootComponent } from './pages/foot/foot.component';
import { bpnotLoggedIn, BusinessComponent } from './pages/business/business.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { environment } from 'src/environments/environment';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    PosteventComponent,
    ProfileComponent,
    GooglemapsComponent,
    EditprofileComponent,
    EditeventComponent,
    NoEventsLandingComponent,
    notLoggedIn,
    noLocation,
    mapsNotLoggedIn,
    FootComponent,
    BusinessComponent,
    bpnotLoggedIn,
    AboutUsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    AgmCoreModule.forRoot({
      apiKey: environment.googleAPI,
      libraries: ['places']
    }),
    MatGoogleMapsAutocompleteModule,
    NgbModule,
    MatInputModule,
  ],
  entryComponents: [notLoggedIn, noLocation, mapsNotLoggedIn, bpnotLoggedIn],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi:true}],
  bootstrap: [AppComponent]
  
})
export class AppModule { }
