import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  
  temp;
  showIfIndividual = false;
  showIfBusiness = false;
  registerForm: FormGroup;
  loading =false;
  submitted=false;
  returnUrl: string;
  error: string;

  constructor(private formBuilder: FormBuilder,private route: ActivatedRoute,private router: Router,private authSvc:AuthService) { }

  ngOnInit(): void {
    this.registerForm=this.formBuilder.group({
      username: ['',Validators.required],
      password: ['',Validators.required],
      indOrBusiness: ['', Validators.required]
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
    if (this.registerForm.invalid) {
      return;
    }
    this.loading = true;
    this.authSvc.register(this.registerForm.controls.username.value,
      this.registerForm.controls.password.value, 
      this.registerForm.controls.indOrBusiness.value == true ? 'I' : 'B').subscribe(response=>{
        this.router.navigate([this.returnUrl]);
      },err=>{this.submitted=false;this.loading=false;this.error=err.message||err;});
  }

}
