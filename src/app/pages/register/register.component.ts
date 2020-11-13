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

  registerForm: FormGroup;
  loading =false;
  submitted=false;
  returnUrl: string;
  error: string;

  constructor(private formBuilder: FormBuilder,private route: ActivatedRoute,private router: Router,private authSvc:AuthService) { }

  ngOnInit(): void {
    this.registerForm=this.formBuilder.group({
      username: ['',Validators.required],
      password: ['',Validators.required]
    });
    this.returnUrl=this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  register(){

  }

}
