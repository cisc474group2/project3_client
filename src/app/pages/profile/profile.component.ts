import { getInterpolationArgsLength } from '@angular/compiler/src/render3/view/util';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { BusModel, Geoloc, IndModel } from '../../../assets/model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  
  profileForm: FormGroup;
  individualForm: FormGroup;
  businessForm: FormGroup;
  returnUrl: string;
  error: string;
  loading = false;
  submitted = false;
  notEditingProfile = true;
  showIfIndividual = false;
  showIfBusiness = false;
  userType = '';
  email: string;

  constructor(private formBuilder: FormBuilder,private route: ActivatedRoute,private router: Router,private authSvc:AuthService) {
    this.authSvc.authorize();
    //TODO
    // we need to get user info and display it here (havent decided how to do this yet)
  
    
   }

  ngOnInit(): void {
    this.authSvc.CurrentUser.subscribe(user => {
      if (user === null) {
        this.router.navigate(['login'])
      }
      else{
        if(this.authSvc.currentType == 'I'){
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
        lastName: ['', Validators.required]
    });

    this.businessForm=this.formBuilder.group({
      businessName: ['', Validators.required],
      businessStreet: ['', Validators.required],
      businessApt: [''],
      businessCity: ['', Validators.required],
      businessState: ['', Validators.required],
      businessZip: ['', Validators.required],
      contactName: ['', Validators.required],
      businessPhone: ['', Validators.required]
    });
    
    // this is how we will preload information into form after we get it from database (how beautiful)
    this.email = "tim@tim.com";
    this.profileForm.setValue({
      email: this.email 
    });
    
    this.returnUrl=this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  
  editProfile(){
    this.notEditingProfile = false;
  }
    
  // take info from form and update db entry
  updateInfo(){
    this.loading = true;
    this.submitted = true;
  }

}
