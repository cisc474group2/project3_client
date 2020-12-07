import { getInterpolationArgsLength } from '@angular/compiler/src/render3/view/util';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { BusModel, Geoloc, IndModel } from '../../../assets/model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  temp;
  individualRegister = false;
  showIfIndividual = false;
  showIfBusiness = false;
  registerForm: FormGroup;
  individualForm: FormGroup;
  businessForm: FormGroup;
  isChecked=false;
  loading =false;
  submitted=false;
  returnUrl: string;
  error: string;
  type_obj:BusModel | IndModel;


  constructor(private formBuilder: FormBuilder,private route: ActivatedRoute,private router: Router,private authSvc:AuthService) { }

  ngOnInit(): void {
    this.registerForm=this.formBuilder.group({
      individual: ['', Validators.required],
      email: ['',Validators.email],
      password: ['',Validators.required]
    });
    this.individualForm=this.formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        zip: ['', Validators.pattern('([0-9]{5}){1}(-[0-9]{4})?')]
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
    this.returnUrl=this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  unhide(e){
    if(e.target.id == "indivCheck" && e.target.checked){
      this.showIfIndividual = true;
      this.showIfBusiness = false;
      this.individualRegister = true;
    }

    if(e.target.id == "indivCheck" && e.target.checked == false){
      this.showIfIndividual = false;
      this.individualRegister = false;
    }

    if(e.target.id == "busCheck" && e.target.checked){
      this.showIfBusiness = true;
      this.showIfIndividual = false;
      this.individualRegister = false;
    }

    if(e.target.id == "busCheck" && e.target.checked == false){
      this.showIfBusiness = false;
    }
    if(e.target != this.temp && this.temp!= undefined){
      e.target.checked = true;
      this.temp.checked = false;
      
    }
    
    this.temp = e.target;
  }


  register(){
    this.submitted == true;
    console.log(this.businessForm);
    if (this.registerForm.invalid || (this.individualRegister && this.individualForm.invalid) 
    || (!this.individualRegister && this.businessForm.invalid)) {
      return;
    }

    this.loading = true;
    if (this.individualRegister) {
      this.type_obj = new IndModel(
        this.individualForm.controls.firstName.value, 
        this.individualForm.controls.lastName.value,
        this.individualForm.controls.zip.value);
    }
    else {
      
      this.type_obj = new BusModel(
        this.businessForm.controls.businessName.value,
        this.businessForm.controls.contactName.value,
        this.businessForm.controls.businessPhone.value,
        '', // business email component
          this.businessForm.controls.businessStreet.value + "+" 
          + this.businessForm.controls.businessApt.value + "+"
          + this.businessForm.controls.businessCity.value + "+"
          + this.businessForm.controls.businessState.value
          + "+" + this.businessForm.controls.businessZip.value
      );
    }
    


    this.authSvc.register(
      this.registerForm.controls.email.value,
      this.registerForm.controls.password.value, 
      this.individualRegister == true ? 'I' : 'B', 
      this.type_obj)
      .subscribe(response=>{
        this.router.navigate([this.returnUrl]);
      },err=>{this.submitted=false;this.loading=false;this.error=err.message||err;});
  }

}
