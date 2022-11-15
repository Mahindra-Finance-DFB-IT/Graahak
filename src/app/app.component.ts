import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {  Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppData } from './models/app';
import { updateAppData } from './models/app.action';
import { AuthService } from './service/auth.service';
import { Location } from '@angular/common';
import { overlayConfigFactory } from 'ngx-modialog';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'frontend';
  authCheck:boolean = false;
  appData$ :Observable<AppData>;
  isAuth:boolean = false;
isAdmin:boolean=false
  constructor(
              //private connectionService:ConnectionService,
              private location:Location,
              private authService:AuthService,
              public router:Router,
         
              private store: Store<{ appItem: AppData }>){
      /*this.appData$ = store.select('appItem');
      this.appData$.subscribe((obj:AppData)=>{
        console.log(obj)
        this.isAuth = (obj?.isAuth)?obj.isAuth:false;
      })
      
      this.connectionService.monitor().subscribe(isConnected => {
        console.log(isConnected);
      })
      */
     //console.log(this.location.path());
     this.isAuth = this.validateAuth();
  }
  ngOnInit(): void {
    this.isAuth = this.validateAuth();
    this.router.events.subscribe(event => {
      //console.log(this.location.path());
      this.isAuth = this.validateAuth();
    });
  }

  validateAuth() {
    return (this.location.path() === '/login' || this.location.path() === '/admin-login') ? false : true;
  }

  logout(){
    let appData:AppData = {
      isAuth:false,
      token:'',
      CustomerToken:{}
    }
    this.authService.logout();
    this.store.dispatch(updateAppData(appData))
    if (this.isAdmin) {
      this.router.navigateByUrl("/admin-login");
    } else {
      this.router.navigateByUrl("/login");
    }
    return;
  }


}
