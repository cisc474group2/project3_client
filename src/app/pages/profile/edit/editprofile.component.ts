import { getInterpolationArgsLength } from '@angular/compiler/src/render3/view/util';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileService} from 'src/app/services/profile.service';


@Component({
  selector: 'app-profile',
  templateUrl: './editprofile.component.html',
  styleUrls: ['./editprofile.component.scss']
})
export class EditprofileComponent implements OnInit {
  
  profileForm: FormGroup;
  individualForm: FormGroup;
  businessForm: FormGroup;
  returnUrl: string;
  error: string;
  loading = false;
  submitted = false;
  notEditingProfile = true;
  email: string;
  reg_events: [];
  fName: string;
  lName: string;
  iZip: string;
  busName: string;
  cName: string;
  cPhone: string;
  mailAddress:string[];
  hostedEvents: [];
  showIfIndividual = false;
  showIfBusiness = false;

  constructor(private formBuilder: FormBuilder,private route: ActivatedRoute,private router: Router,private authSvc:AuthService, private profileSvc: ProfileService) {
    this.authSvc.authorize();

        this.authSvc.CurrentUser.subscribe(user => {
            if (user === null || user === undefined) {
                this.router.navigate(['login'])
            } else {
              this.email = this.authSvc.userObject.email;
              this.reg_events = this.authSvc.userObject.reg_events;
              if(this.authSvc.userObject.type == 'I'){
                this.fName = this.authSvc.userObject.type_obj.fName;
                this.lName = this.authSvc.userObject.type_obj.lName;
                this.iZip = this.authSvc.userObject.type_obj.zip;
              }
              else{
                this.busName = this.authSvc.userObject.type_obj.bus_name;
                this.cName = this.authSvc.userObject.type_obj.cName;
                this.cPhone = this.authSvc.userObject.type_obj.cPhone;
                this.mailAddress = this.authSvc.userObject.type_obj.mailAddress.split('+');
                this.hostedEvents = this.authSvc.userObject.type_obj.hostedEvents;
              }
            }
        });
    
  
    
   }

  ngOnInit(): void {
    this.authSvc.CurrentUser.subscribe(user => {
      if (user === null) {
        this.router.navigate(['login'])
      }
      else{
        if(this.authSvc.userObject.type == 'I'){
          this.showIfIndividual = true;
          this.showIfBusiness = false;
        }
        else{
          this.showIfBusiness = true;
          this.showIfIndividual = false;
        }
      }
  });

    this.profileForm=this.formBuilder.group({
      email: ['',Validators.required]
    });
    this.individualForm=this.formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        zip: ['', [Validators.pattern('([0-9]{5}){1}(-[0-9]{4})?'),Validators.required]]
    });

    this.businessForm=this.formBuilder.group({
      businessName: ['', Validators.required],
      businessStreet: ['', Validators.required],
      businessApt: [''],
      businessCity: ['', Validators.required],
      businessState: ['', Validators.required],
      businessZip: ['', [Validators.pattern('([0-9]{5}){1}(-[0-9]{4})?'),Validators.required]],
      contactName: ['', Validators.required],
      businessPhone: ['', [Validators.required,Validators.pattern('([0-9]{3}){1}(-[0-9]{3}){1}(-[0-9]{4}){1}')]]
    });
    
    this.profileForm.setValue({
      email: this.email 
    });

  if(this.authSvc.userObject.type == 'I'){
    this.individualForm.setValue({
      firstName: this.fName,
      lastName: this.lName,
      zip: this.iZip
    });
  }

  else{
    this.businessForm.setValue({
      businessName: this.busName,
      contactName: this.cName,
      businessPhone: this.cPhone,
      businessStreet: this.mailAddress[0],
      businessApt: this.mailAddress[1],
      businessCity: this.mailAddress[2], 
      businessState: this.mailAddress[3],
      businessZip: this.mailAddress[4]
    });
  }


    
    this.returnUrl=this.route.snapshot.queryParams['returnUrl'] || '/';
  }
 
    

  // take info from form and update db entry
  updateInfo(){
    this.loading = true;
    this.submitted = true;
    if(this.profileForm.invalid || (this.authSvc.userObject.type == 'I' && this.individualForm.invalid) || (this.authSvc.userObject.type == 'B' && this.businessForm.invalid)){
      return;
    }

    if(this.authSvc.userObject.type == 'I'){
      this.authSvc.userObject.type_obj.fName = this.individualForm.controls.firstName.value;
      this.authSvc.userObject.type_obj.lName = this.individualForm.controls.lastName.value;
      this.authSvc.userObject.type_obj.zip = this.individualForm.controls.zip.value;
    }

    else{
      this.authSvc.userObject.type_obj.bus_name = this.businessForm.controls.businessName.value;
      this.authSvc.userObject.type_obj.cName = this.businessForm.controls.contactName.value;
      this.authSvc.userObject.type_obj.cPhone = this.businessForm.controls.businessPhone.value;
      this.authSvc.userObject.type_obj.mailAddress = this.businessForm.controls.businessStreet.value + "+" 
      + this.businessForm.controls.businessApt.value + "+"
      + this.businessForm.controls.businessCity.value + "+"
      + this.businessForm.controls.businessState.value
      + "+" + this.businessForm.controls.businessZip.value;
    }

    this.profileSvc.updateUser(this.authSvc.userObject._id, 
      this.profileForm.controls.email.value, this.authSvc.userObject.type_obj, this.authSvc.userObject.reg_events).subscribe(response=>{
        this.router.navigate(['/profile']);
      },err=>{this.submitted=false;this.loading=false;this.error=err.message||err;});
    }

  

}
