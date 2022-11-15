import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { error } from 'jquery';
import { debounceTime,fromEvent,Observable, Subject } from 'rxjs';
import { ApiService } from 'src/app/service/api.service';
import { AppData, CustomerSearch, LoginType } from './../../models/app';


@Component({
  selector: 'app-customersearch',
  templateUrl: './customersearch.component.html',
  styleUrls: ['./customersearch.component.css']
})
export class CustomersearchComponent implements OnInit {

  customerSearch: CustomerSearch={
    //searchCustomer: ''
  };

  custSearchForm = new FormGroup({
    searchCustomer: new FormControl(this.customerSearch?.searchCustomer,[
        Validators.required,
        this.searchTextFieldValidation]),
  });

 
  searchTextFieldValidation(formControl:AbstractControl){
     let err = {
        validPanCard: true,
        validMobileNumber: true,
        showErrorPan: false,
        showErrorMob: false,
      };
      const str = formControl.value;
      const firstChar = str?.charAt(0);
      if(firstChar && firstChar.match(/[A-Za-z]/)){
        if(str?.match(/^[A-Za-z]{5}[0-9]{4}[A-Za-z]$/)) {
              err.validPanCard = false
        }else{
          err.showErrorPan= true
        }
      }
      if(firstChar && firstChar.match(/[0-9]/)){
        if(str?.match(/^[0-9]{10}/)) {
            err.validMobileNumber = false
        }else{
            err.showErrorMob = true;
        }
      }
      return err; 
   }

  submitted:boolean = false;
  appData$ :Observable<AppData>;
  appData:AppData = {};
  invalidMessage:string= "";
  messageTimeOutInSeconds = 10000;
  private _error = new Subject<string>();
  @ViewChild('selfClosingErrorAlert', {static: false}) 
  selfClosingErrorAlert: NgbAlert;

  constructor(public router:Router,
              private apiService: ApiService,
              private store:Store<{appItem: AppData }>) {
        this.appData$ = store.select('appItem');
        this.appData$.subscribe((obj:AppData)=>{
          this.appData = obj;
        })
        
  }

  keyPressAlphaNumeric(event:any) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  ngOnInit(): void {
    this._error.subscribe(message => this.invalidMessage = message);
    this._error.pipe(debounceTime(this.messageTimeOutInSeconds)).subscribe(()=>{
      if(this.selfClosingErrorAlert){
        this.selfClosingErrorAlert.close();
      }
    })
  }

  get custSearchFormControl() {
    return this.custSearchForm.controls;
  }

  public changeErrorMessage(msg:String) { this._error.next(msg.toString()); }

  onSubmit(){
    this.submitted=true;
   //console.log("i am here");
   // console.log(this.custSearchFormControl.searchCustomer.errors); 
    if(!this.custSearchFormControl.searchCustomer.errors?.['validPanCard'] || !this.custSearchFormControl.searchCustomer.errors?.['validMobileNumber']){
     //  console.log("i am here2");
        this.customerSearch.searchData = this.custSearchFormControl.searchCustomer.value;
        this.customerSearch.loginType = this.appData.loginType;
        if(this.customerSearch.loginType == LoginType.SALESEXECUTIVE){
          this.customerSearch.mobileNumber = this.appData.userId;
        }
        if(this.customerSearch.loginType == LoginType.SMRSM){
          this.customerSearch.sapId = this.appData.userId;
        }
        let token:String = ''; 
        if(this.appData.token){
          token = this.appData.token;
        }
        this.apiService.getCustomerDetails(this.customerSearch,token).subscribe((data:any)=>{
          if(data.length>0){
            this.router.navigateByUrl("/customer_details", { state: { 
              customerData:data,
              customerSearch:this.customerSearch 
            }})
          }else{
            this.changeErrorMessage("No data found");    
          }
        },(err:any)=>{
          if(err.status == 401){
              this.router.navigateByUrl("/home");
          }else{
            if(err.error.error || err.error.errors){
              //this.errorObj = err.error;
              this.changeErrorMessage(err.error.error);
            }else{
              //this.errorObj = {error: err.message};
              this.changeErrorMessage(err.message);
            }
          }
        })
        
    }
  }

}
