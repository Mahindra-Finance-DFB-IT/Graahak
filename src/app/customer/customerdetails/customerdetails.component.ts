import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { LoaderComponent } from 'src/app/loader/loader.component';
import { LogoutComponent } from 'src/app/logout.component';
import { CustomerSearch, Login, LoginType, PageName } from 'src/app/models/app';
import { AppData } from 'src/app/models/app';
import { OtpComponent } from 'src/app/otp/otp.component';
import { ApiService } from 'src/app/service/api.service';
import { AuthService } from 'src/app/service/auth.service';
@Component({
  selector: 'app-customerdetails',
  templateUrl: './customerdetails.component.html',
  styleUrls: ['./customerdetails.component.css']
})
export class CustomerdetailsComponent implements OnInit {
  
  login: Login = {};
  appData$ :Observable<AppData>;
  curDate = Date.now();
  customerData:{[key: string]: string} = {};
  currentLoanNumber: string = '';
  appData:AppData = {}
  @ViewChild('accountNumberTemplate',{read: TemplateRef})
  accountNumberTemplate: TemplateRef<any>;
  accmodalRef:any;
  //otpmodalRef:any;
  otherDetails = false;
  showOtpScreen= false;
  customerSearch:CustomerSearch={};
  scheduleData:any = null;
  constructor(
              public route:Router,
              private authService:AuthService,
              private modalService: NgbModal,
              private apiService:ApiService,
              private store: Store<{ appItem: AppData }>) {
              

    this.appData$ = store.select('appItem');
    this.appData$.subscribe((obj:AppData)=>{
      this.appData = obj;

      if(this.appData.loginType == LoginType.SALESEXECUTIVE){
          this.showOtpScreen = true;
      }

      if(this.appData.loginType == LoginType.SMRSM){
        this.otherDetails = true;
      }
      this.apiService.getScheduleData(this.appData.token||'').subscribe(data=>{
        this.scheduleData = data;
      })

    })

    const state:any = this.route.getCurrentNavigation()?.extras?.state;
    
    if(!state?.customerData){
      this.route.navigateByUrl("/customer_search");
      return;
    }

    this.customerSearch = state?.customerSearch;

    state?.customerData.forEach((element:any) => {
        if(this.currentLoanNumber ==  ''){
          this.currentLoanNumber = element.loan_number;
        }
        if(element?.limit_status == 1){
          element.limit_status_display = "ACTIVE";
        }else{
          element.limit_status_display = "INACTIVE";
        }
        this.customerData[element.loan_number] = element;
    });
      //console.log(this.customerData);
  }

  changeCurrentAccNo(accNo:any){
    //console.log(accNo);
    this.currentLoanNumber = accNo;
    //console.log("SO ACC NO:", this.currentLoanNumber);
    if(this.accmodalRef){
      this.accmodalRef.close();
    }
  }

  ngOnInit(): void {
    
  }

  get CurrentCustomerData() : any{
    return this.customerData[this.currentLoanNumber];
  }
  
  openOtpModal(){
    if(this.customerSearch.loginType == LoginType.SALESEXECUTIVE){
      const loaderRef = this.modalService.open(LoaderComponent,{
        centered: true,
        animation:true,
        backdrop:'static',
        keyboard: false,
        windowClass:"remove-bg-modal",
        size:"sm",
      });

      this.apiService.fetchSmRsmMobile(this.customerSearch,this.appData?.token || "").subscribe((data:any)=>{
        loaderRef.close();
        //console.log(data);
        const otpmodalRef = this.modalService.open(OtpComponent,{
          centered: true,
          backdrop: true
        });
        //console.log(this.appData);
        let appData:AppData={
          transactionID : data?.transactionID.toString(),
          loginType: this.appData.loginType,
          token: this.appData.token
        }
        this.login.appData = appData;
        this.login.dispatchAppData = false;
        this.login.salesExecutive = {
          mobileNumber : data?.sm_mobile_no
        }
        this.login.SmMobileNumber = data?.sm_mobile_no;
        this.login.RsmMobileNumber = data?.rsm_mobile_no;
        this.login.customerSearch = this.customerSearch;
        this.login.fromPage=PageName.CustomerDetails;
        
        otpmodalRef.componentInstance.login = this.login;
        otpmodalRef.closed.subscribe((_d:any)=>{
          if(_d.successOtp){
              this.otherDetails = true;
              this.showOtpScreen = false;
          }
        })
      },async (err)=>{
        //console.log(err);
        loaderRef.close();
        const logoutModalRef =  await this.modalService.open(LogoutComponent,{
          centered: true,
          animation:true,
          backdrop:'static',
          keyboard: false,
          size:"sm",
        })
        logoutModalRef.closed.subscribe(_d=>{
          console.log(err);
          this.authService.logout();
          this.route.navigate(['/login']);
          return false;
        })
      })
    }
  }/**/


  open() {
    this.accmodalRef =  this.modalService.open(this.accountNumberTemplate, {
      animation: true,
      size:'sm',
      centered: true,
    })
  }
}
