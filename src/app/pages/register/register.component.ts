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
  
  hidden = false;
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

  unhide(){
    this.hidden = !this.hidden;
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
