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
  returnUrl: string;
  error: string;

  constructor(private formBuilder: FormBuilder,private route: ActivatedRoute,private router: Router,private authSvc:AuthService) { }

  ngOnInit(): void {
    this.profileForm=this.formBuilder.group({
      individual: ['', Validators.required],
      email: ['',Validators.required],
      password: ['',Validators.required]
    });
    

    this.returnUrl=this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  
  
    

}
