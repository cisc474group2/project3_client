import {getInterpolationArgsLength} from '@angular/compiler/src/render3/view/util';
import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from 'src/app/services/auth.service';
import {ProfileService} from 'src/app/services/profile.service';
import {EventsService} from 'src/app/services/events.service';
import {EventModel} from '../../../assets/model';
import {BusModel, Geoloc, IndModel} from '../../../assets/model';
import {title} from 'process';

@Component({selector: 'app-profile', templateUrl: './profile.component.html', styleUrls: ['./profile.component.scss']})
export class ProfileComponent implements OnInit {

    returnUrl : string;
    error : string;
    loading = false;
    submitted = false;
    notEditingProfile = true;
    email : string;
    reg_events : EventModel[];
    fName : string;
    lName : string;
    busName : string;
    cName : string;
    cPhone : string;
    mailAddress : string[];
    hostedEvents : EventModel[];
    showIfIndividual = false;
    showIfBusiness = false;
    checkingRegisteredEvents = true;
    checkingHostedEvents = false;
    profileEventsLoaded = false;

    constructor(private formBuilder : FormBuilder, private route : ActivatedRoute, private router : Router, private authSvc : AuthService, private profileSvc : ProfileService, private eventSvc : EventsService) {
        this.authSvc.authorize();

        this.authSvc.CurrentUser.subscribe(user => {
            if (user === null || user === undefined) {
                this.router.navigate(['login'])
            } else {
                if (this.authSvc.userObject.type == 'I') {
                    this.fName = this.authSvc.userObject.type_obj.fName;
                    this.lName = this.authSvc.userObject.type_obj.lName;
                } else {
                    this.busName = this.authSvc.userObject.type_obj.bus_name;
                    this.cName = this.authSvc.userObject.type_obj.cName;
                    this.cPhone = this.authSvc.userObject.type_obj.cPhone;
                    this.mailAddress = this.authSvc.userObject.type_obj.mailAddress.split('+');
                    for (let i = 0; i < this.mailAddress.length; i++) {
                        if (this.mailAddress[i] == "") {
                            this.mailAddress.splice(i, 1);
                        }
                        this.mailAddress[i] = " " + this.mailAddress[i];
                    }
                }
            }
        });
    }

    registeredEvents(){
        if(this.reg_events === null){
            return false;
        }
        else return this.reg_events.length != 0;
    
    }

    areThereHostedEvents(){
        if(this.hostedEvents === null){
            return false;
        }
        else return this.hostedEvents.length != 0;
    }

    postEvent(){
        this.router.navigate(['postevent']);
    }

    goHome(){
        this.router.navigate(['home']);
    }

    eventsLoaded(): boolean{
        return this.eventSvc.profile_events_loaded.value && this.eventSvc.profile_business_events_loaded.value;
    }

    ngOnInit(): void {
    
        this.authSvc.CurrentUser.subscribe(user => {
            if (user === null) {
                this.router.navigate(['login'])
            } else {
                this.email = this.authSvc.userObject.email;
                this.updateLists();


                this.eventSvc.profile_event_list.subscribe((event_list : Array < EventModel >) => {
                    this.reg_events = event_list;
                    
                });
                if (this.authSvc.userObject.type === 'B') {
                    this.eventSvc.profile_business_event_list.subscribe((event_list) => {
                        this.hostedEvents = event_list
                    })
                }
                if (this.authSvc.userObject.type == 'I') {
                    this.showIfIndividual = true;
                    this.showIfBusiness = false;
                } else {
                    this.showIfBusiness = true;
                    this.showIfIndividual = false;
                }
            }
        });


        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    editProfile() {
        this.router.navigate(['profile/edit']);
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
                this.updateLists()
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

    onTabSelectChange(tab : MatTabChangeEvent) {
        switch (tab.index) {
            case 0:
                this.checkingHostedEvents = false;
                this.checkingRegisteredEvents = true;
                break;
            case 1:
                this.checkingHostedEvents = true;
                this.checkingRegisteredEvents = false;
                break;
        }

    }

    editEvent(event : EventModel) {
        this.eventSvc.current_event = event;
        this.router.navigate(['editevent']);
    }

    registerUser(event) {
        this.authSvc.authorize();
        if (!this.authSvc.userObject.reg_events.includes(event._id)) {
            this.authSvc.userObject.reg_events.push(event._id);

            this.profileSvc.updateUser(this.authSvc.userObject._id, this.authSvc.userObject.email, this.authSvc.userObject.type_obj, this.authSvc.userObject.reg_events).subscribe(response => {
                console.log(response);
                // this.eventSvc.getEventsFormat();
                event.registered = !event.registered;
                event.registered_ind.length ++;
                this.updateLists()
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

    currentBusiness(id : string): boolean {
        if (this.authSvc.userObject != null) {
            return id == this.authSvc.userObject._id;
        } else 
            return false;
        

    }

    updateLists(): void {
        this.eventSvc.getProfileEventList();
        if (this.authSvc.userObject.type === "B") 
            this.eventSvc.getProfileBusinessEventList();
        

    }
}
