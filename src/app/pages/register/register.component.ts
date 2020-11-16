import { getInterpolationArgsLength } from '@angular/compiler/src/render3/view/util';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
  hidden = true;
  showIfIndividual = false;
  showIfBusiness = false;
  registerForm: FormGroup;
  isChecked=false;
  loading =false;
  submitted=false;
  returnUrl: string;
  error: string;
  type_obj:BusModel | IndModel;


  constructor(private formBuilder: FormBuilder,private route: ActivatedRoute,private router: Router,private authSvc:AuthService) { }

  ngOnInit(): void {
    this.registerForm=this.formBuilder.group({
      email: ['',Validators.required],
      password: ['',Validators.required],
      individual: [''], 
      firstName: [''],
      lastName: [''],
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
    }

    if(e.target.id == "indivCheck" && e.target.checked == false){
      this.showIfIndividual = false;
    }

    if(e.target.id == "busCheck" && e.target.checked){
      this.showIfBusiness = true;
      this.showIfIndividual = false;
    }

    if(e.target.id == "busCheck" && e.target.checked == false){
      this.showIfBusiness = false;
    }
    if(e.target != this.temp && this.temp!= undefined){
      this.temp.checked = false;
    }
    this.temp = e.target;
  }


  register(){
    this.submitted == true;
    console.log(this.registerForm)
    if (this.registerForm.invalid) {
      return;
    }
    this.loading = true;
    if (!this.registerForm.controls.individual.value) {
      this.type_obj = new IndModel(
        this.registerForm.controls.firstName.value, 
        this.registerForm.controls.lastName.value);
    }
    else {
      this.type_obj = new BusModel(
        this.registerForm.controls.businessName.value,
        this.registerForm.controls.contactName.value,
        this.registerForm.controls.businessPhone.value,
        '', // business email component
        new Geoloc(this.registerForm.controls.businessStreet.value + "+" 
          + this.registerForm.controls.businessApt.value + "+"
          + this.registerForm.controls.businessCity.value + "+"
          + this.registerForm.controls.businessState.value
          //+ "+" + this.registerForm.controls.businessZip.value
          ),
        this.registerForm.controls.businessStreet.value
      );
    }
    

    this.authSvc.register(
      this.registerForm.controls.email.value,
      this.registerForm.controls.password.value, 
      this.registerForm.controls.individual.value == false ? 'I' : 'B', 
      this.type_obj)
      .subscribe(response=>{
        this.router.navigate([this.returnUrl]);
      },err=>{this.submitted=false;this.loading=false;this.error=err.message||err;});
  }

}
