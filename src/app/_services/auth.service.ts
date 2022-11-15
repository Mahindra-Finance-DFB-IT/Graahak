import { Injectable } from '@angular/core';
import { AppData } from '../_models/app';
import {LocalStorageService} from "./local-storage.service";
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoggedIn = false;
  key:string = "___mahifin_storage";

  constructor(private localStorageService:LocalStorageService) { }

  isAuthenticated(){
    let data:AppData =this.localStorageService.getItem(this.key);
    return (data.token)?true:false;
  }

  save(value:AppData){
    let data = this.localStorageService.getItem(this.key)
    if(data != null){
      value = {...data,...value}
    }
    this.localStorageService.setItem(this.key,value);
  }

  logout(){
    this.localStorageService.clear();
  }

  getData():AppData{
    return  this.localStorageService.getItem(this.key);
  }

}
