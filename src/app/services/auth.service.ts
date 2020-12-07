import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { UserModel, BusModel, IndModel} from "../../assets/model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private path='http://localhost:3000/api/security/'
  private _token:string=null;
  CurrentUser: BehaviorSubject<UserModel>=new BehaviorSubject<UserModel>(null);
  userObject;
//CurrentUser: ReplaySubject<string>=new BehaviorSubject<string>();
//Replay sends ALL versions of the subject
//Behavior sends !!THE MOST RECENT ONE ONLY!!.
  get token():string{
    if (this._token==null){
      this._token=localStorage.getItem('token')
    }
    return this._token;
  }
  
  set token(val:string){
    this._token=val;
    if (val==null)
      localStorage.removeItem('token');
    else
      localStorage.setItem('token',val);
  }
  get loggedIn():boolean{
    return this.token!=null;
  }

  constructor(private http:HttpClient) { 
    this.CurrentUser.next(null);
  }

  

  //authorize calls the underlying api to see if the current token is valid (if it exists) and clears it if it is not.
  //returns string of the user type AND updates token if it is invalid
  authorize(type:string=''):void{
    let given_type = '';
    this.http.get(this.path+'authorize').subscribe(result=>{
      //on success, we do nothing because token is good
      this.userObject = result['data'];
      
      if (result['status']!='success'){
        this.token=null;
      }
      else{
        this.CurrentUser.next(this.userObject)
      }
    },err=>{
      this.token=null;
    });
  }

  
 

  login(email: string,password:string): Observable<any>{
    return this.http.post<any>(this.path+'login',{email: email,password: password })
      .pipe(map(user=>{
        this.token=user.data.token
        this.CurrentUser.next(user.data.user.email);
        this.authorize();
        return user.data.user;
      }),catchError(err=>{this.CurrentUser.next(null);this.token=null;return throwError(err.message||'server error')}));
  }

  register(email: string, password:string, type:string, type_obj:IndModel | BusModel): Observable<any>{
      return this.http.post<any>(this.path+'register',{email: email,password: password, type: type, type_obj: type_obj })
        .pipe(map(user=>{
          this.token=user.data.token
          this.CurrentUser.next(user.data.user.email);
          return user.data.user;
        }),catchError(err=>{this.CurrentUser.next(null);this.token=null;return throwError(err.message||'server error')}));
  }

  logout(){
    this.token=null;
    this.CurrentUser.next(null);
    this.userObject=null;
    //subscribe to userObject
  }

}
