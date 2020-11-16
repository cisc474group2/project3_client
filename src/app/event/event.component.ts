import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {
  private path='http://localhost:3000/api/events/'

  constructor() { }

  ngOnInit(): void {
  }

  getEventInfo(email: string,password:string): Observable<any>{
    return this.http.get<any>(this.path)
      .pipe(map(user=>{
        this.token=user.data.token
        return user.data.user;
      }),catchError(err=>{this.CurrentUser.next(null);this.token=null;return throwError(err.message||'server error')}));
  }

}
