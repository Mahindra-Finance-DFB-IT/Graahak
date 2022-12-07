import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import {  debounceTime, Observable, Subject, Subscription, timer } from 'rxjs';
import { CustomerSearch, Login, PageName, VerifyOTP } from '../models/app';
import {NgbActiveModal, NgbAlert} from '@ng-bootstrap/ng-bootstrap';
import * as Forge from 'node-forge';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { Store } from '@ngrx/store';
import { AppData } from '../models/app';
import { updateAppData } from '../models/app.action';
import { ApiService } from '../service/api.service';
import { environment } from 'src/environments/environment';
import { FormControl, Validators } from '@angular/forms';
import { NgOtpInputComponent } from 'ng-otp-input/lib/components/ng-otp-input/ng-otp-input.component';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css']
})
export class OtpComponent implements OnInit,OnDestroy,OnChanges {

  countDown: Subscription | undefined;
  counter = environment.resendOTPTimeInSeconds;
  messageTimeOutInSeconds = 2000;
  tick = 1000;
  successOtp= false;
  invalidOtp=false;
  showTimer=true;
  @ViewChild("ngOtpInput") 
  ngOtpInputRef: NgOtpInputComponent;
  @ViewChild('selfClosingAlert', {static: false}) 
  selfClosingAlert: NgbAlert;
  @ViewChild('selfClosingErrorAlert', {static: false}) 
  selfClosingErrorAlert: NgbAlert;
  attempt = 0; 
  invalidOtpMessage = ""
  successOtpMessage = "";
  otpOverlayOpacity=false;
  private _success = new Subject<string>();
  private _error = new Subject<string>();

  RSA_PUBLIC_KEY = `LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlHZk1BMEdDU3FHU0liM0RRRUJBUVVBQTRHTkFE
    Q0JpUUtCZ1FDcHZmVy9HK1J4ZUlKaHhZS0pFaEZhbkFlbwoydnhEWjFLY3VNa1cyc29Ya1VBWHk0
    Nm40cThlWko2VEF3VDFyR04zSEphVEMzUG5hLzU1eHNDL1ovWmVTN21UCjZzY0VIL2tBdyt2aWhB
    bjNnUW5hRUZMZkpYcU9ObGRqV2lwdVUvWEphbkdCVzlybkFiMDIxVnhQbDJoR1oyeC8KbU5tQW1j
    eWZqZlhzYWZ4MmR3SURBUUFCCi0tLS0tRU5EIFBVQkxJQyBLRVktLS0tLQo=`;

  @Input() login: Login;

  config = {
    length:4,
    allowNumbersOnly:true,
    isPasswordInput:true,
    containerClass: "otpwrapper",
    inputClass:"otpinput"
  }
  
  sub:any;
  pageName = PageName;

  constructor(public activeModal:NgbActiveModal,
    private authService: AuthService,
    private apiService:ApiService,
    private router: Router,
    private store: Store<{ appItem: AppData }>){
  }
  ngOnChanges(changes: SimpleChanges): void {
  }
  
  ngOnInit(): void {
    if(this.login.fromPage == PageName.CustomerDetails){
      this.config.length = 4;
    }
    this.countDown = timer(0, this.tick).subscribe(() => --this.counter);
    this._success.subscribe(message => this.successOtpMessage = message);
    this._error.subscribe(message => this.invalidOtpMessage = message);
    this._success.pipe(debounceTime(this.messageTimeOutInSeconds)).subscribe(() => {
      if (this.selfClosingAlert) {
        this.selfClosingAlert.close();
      }
      if(this.successOtp){
        
        this.activeModal.close({
          successOtp: this.successOtp
        });
        this.invalidOtp = false;
        this.successOtp = false; 
        if(this.login?.fromPage == PageName.Home){
          this.router.navigateByUrl('/report',{
            state:{
              loginSuccess: true 
            }
          });
        }     
        if(this.login?.fromPage == PageName.LoginPage){
          this.router.navigateByUrl('/home');
        }
        if(this.login?.fromPage == PageName.CustomerDetails){
          //this.router.navigate(['customer_details'])
        }
      }
    });
    this._error.pipe(debounceTime(this.messageTimeOutInSeconds)).subscribe(()=>{
      if(this.selfClosingErrorAlert){
        this.selfClosingErrorAlert.close();
      }
    })
  }

  public changeSuccessMessage(msg:String) { this._success.next(msg.toString()); }
  public changeErrorMessage(msg:String) { this._error.next(msg.toString()); }

  ngOnDestroy(){
    this.countDown?.unsubscribe();
  }

  resendOTP(){
    this.otpOverlayOpacity = true;
    let api:any;
    if(this.login.fromPage == PageName.CustomerDetails){
        //let custSerarch :CustomerSearch;
        //console.log(this.login);
        api = this.apiService.resendOtpSmRsmMobile(this.login?.customerSearch||{},this.login.appData?.token||'');
    }else{
      let verifyOTP: VerifyOTP= {
        mobileNumber : this.login.salesExecutive?.mobileNumber?.toString(),
        transactionID: this.login.appData?.transactionID?.toString(),
        fromPage: this.login.salesExecutive?.fromPage?.toString(),
      };
      api = this.apiService.otpResend(verifyOTP);
    }
    api.subscribe((data:any)=>{
      this.changeSuccessMessage("OTP is successfully resent!");
      this.counter = environment.resendOTPTimeInSeconds;
      this.otpOverlayOpacity = false;
    },(err:any)=>{
      let msg = (err.error.error)?err.error.error:err.message;
      this.changeErrorMessage(msg);
      this.otpOverlayOpacity = false;
    });
  }

  onOtpChange(event:String){
    let otp = event;
    console.log(event);
    const publicKey = Forge.pki.publicKeyFromPem(Forge.util.decode64(this.RSA_PUBLIC_KEY));
    const encryptedPassword = publicKey.encrypt(otp.toString(),'RSAES-PKCS1-V1_5');
    let encryptOtp = Forge.util.encode64(encryptedPassword);

    if(event.length==this.config.length && this.attempt<=3){
        this.otpOverlayOpacity = true;
        this.attempt++;
        this.ngOtpInputRef.otpForm.disable()
        //this.showTimer=false;
        let mobileNumber:any = '';
        let api: any;
        if(this.login?.fromPage == PageName.CustomerDetails){
          let verifyOTP: VerifyOTP= {
            mobileNumber: this.login.SmMobileNumber,
            otp : encryptOtp,
            transactionID: this.login.appData?.transactionID?.toString() || Date.now().toString(),
            fromPage: this.login?.fromPage
          };
           api = this.apiService.verifyOtpSmRsmMobile(verifyOTP,this.login.appData?.token || '');
        }else{
          mobileNumber = this.login.salesExecutive?.mobileNumber || ''
          
          let verifyOTP: VerifyOTP= {
            mobileNumber,
            otp : encryptOtp,
            transactionID: this.login.appData?.transactionID?.toString() || Date.now().toString(),
            fromPage: this.login?.fromPage
          };
          api = this.apiService.otpValidate(verifyOTP);
        }
        api.subscribe(
          (data: any)=>{
           if(data.token){
              let appData: AppData = this.login.appData || {};
              appData.isAuth = true;
              appData.token = data.token;
              appData.salesExecutive = this.login.salesExecutive;
              if(this.login.dispatchAppData){
                this.store.dispatch(updateAppData(appData));
              }
              this.successOtp = true;
              this.invalidOtp = false;
              this.changeSuccessMessage("OTP Verified Successfully!")
            }else{
              this.otpOverlayOpacity = false;
              this.ngOtpInputRef.otpForm.enable();
              this.ngOtpInputRef.setValue("");
              this.invalidOtp  = true;
              this.successOtp = false;
              this.changeErrorMessage("Invalid OTP!")
            }
          },
          (err: any)=>{
            this.otpOverlayOpacity = false;
            console.log(err);
            console.log(this.counter);
            this.ngOtpInputRef.otpForm.enable();
            this.ngOtpInputRef.setValue("");
            this.changeErrorMessage("Invalid OTP!");
          }
        );
        
    }else{
      if(this.attempt>=3){
        this.otpOverlayOpacity = false;
        this.invalidOtp = true;
        this.changeErrorMessage("Max 3 Consecutive Attempts");
      }
      //this.invalidOtp  = true
    }
  }
  closeOverlay(){
    this.otpOverlayOpacity = false;
    if(this.login?.displayOverlay){
      this.login.displayOverlay = false;
    }
  }

}
