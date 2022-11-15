import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbAlert, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/internal/Observable';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { Subject } from 'rxjs/internal/Subject';
import { LoaderComponent } from '../loader/loader.component';
import { AppData, Login, LoginType, PageName } from '../models/app';
import { OtpComponent } from '../otp/otp.component';
import { ApiService } from '../service/api.service';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  appData$ :Observable<AppData>;
  appData:AppData = {};
  
  disabled:Boolean=true;
  submitted:boolean= false;
  error:boolean = false;
  errorObj:any=null;
  private _error = new Subject<string>();
  messageTimeOutInSeconds = 10000;
  invalidMessage = ""

  @ViewChild('selfClosingErrorAlert', {static: false}) 
  selfClosingErrorAlert: NgbAlert;

  constructor(
    private authService:AuthService,
    public router:Router,
    private modalService: NgbModal,
    private apiService: ApiService,
    private store:Store<{appItem: AppData }>) { 
        this.appData$ = store.select('appItem');
        this.appData$.subscribe((obj:AppData)=>{
          this.appData = obj;
        })
    }

    public changeErrorMessage(msg:String) { this._error.next(msg.toString()); }

    ngOnInit(): void {
      this._error.subscribe(message => this.invalidMessage = message);
      this._error.pipe(debounceTime(this.messageTimeOutInSeconds)).subscribe(()=>{
        if(this.selfClosingErrorAlert){
          this.selfClosingErrorAlert.close();
        }
      })
    }
    getScheme(){
      this.authService.userPosId = '5001';
      this.router.navigateByUrl("/scheme-cal")
}
    getReport(){
      if(this.appData.loginType == LoginType.SALESEXECUTIVE){
        const loaderRef = this.modalService.open(LoaderComponent,{
          centered: true,
          animation:true,
          backdrop:'static',
          keyboard: false,
          windowClass:"remove-bg-modal",
          size:"sm",
        });
        let login: Login ={};
        login.loginType = this.appData.loginType;
        login.salesExecutive = Object.assign({},this.appData.salesExecutive);
        login.fromPage = PageName.Home;
        this.apiService.merchantValidate(login).subscribe((data: any)=>{
              loaderRef.close();
              let appData:AppData={
                  transactionID : data?.transactionID.toString(),
                  isAuth: false,
                  token:'',
                  loginType: login.loginType,
                  userId: login.salesExecutive?.mobileNumber
              }
              login.displayOverlay = true;
              login.appData = appData;
              login.dispatchAppData = false;
             
              const modalRef = this.modalService.open(OtpComponent,{
                centered: true
              });
              modalRef.componentInstance.login = login;
          },(err)=>{
              loaderRef.close();
              this.disabled = true;
              this.error = true;
              if(err.error.error || err.error.errors){
                if(err.error?.error){
                  this.changeErrorMessage(err.error.error);
                }
                if(err.error?.errors){
                  err.error?.errors.forEach((_m: String) => {
                    this.changeErrorMessage(_m);
                  });
                }
              }else{
                this.changeErrorMessage(err.message);
              }
              //}
              //console.log(err);
          })
      }else{
        this.router.navigateByUrl("report",{state:{
          loginSuccess: true 
        }});
        return;
      }
    }
}
