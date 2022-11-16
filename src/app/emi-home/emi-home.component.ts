import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { Observable, Subject } from 'rxjs';
import { ApiService } from '../service/api.service';
import { AppData } from 'src/app/models/app';
import { HttpClient } from '@angular/common/http';
// import { MatDialogRef } from '@angular/material';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { LoaderComponent } from '../loader/loader.component';
import { Store } from '@ngrx/store';
import { LogoutComponent } from '../logout.component';
import { Router } from '@angular/router';

@Component({
  selector: 'emi-home',
  templateUrl: './emi-home.component.html',
  styleUrls: ['./emi-home.component.css']
})
export class EmiHomeComponent implements OnInit {
  [x: string]: any;
  isBttonShow = false;
  selectedTenure = "0";
  closeResult = '';
  curDate = Date.now();
  reportData: any = [];
  public innerWidth: any;
  appData$: Observable<AppData>;
  appData: AppData = {}
  @ViewChild(DataTableDirective, { static: true })
  datatableElement: DataTableDirective;
  dtTrigger: Subject<ADTSettings> = new Subject();
  private _error = new Subject<string>();
  showOtpScreen = false;
  otherDetails = false;
  isselect = false
  data: any;
  errMsg: string;
  searchText: '';
  advanceEmi: any;
  schemeData: any
  pcgdata: any;
  constructor(
    public apiService: ApiService,
    public http: HttpClient,
    private modalService: NgbModal,
    private authService: AuthService,
    public route:Router,
    private store:Store<{appItem: AppData }>
  ) {
    this.appData$ = store.select('appItem');
    this.appData$.subscribe((obj:AppData)=>{
      this.appData = obj;
    })
  }


  ngOnInit(): void {
    this.dcgMaster();
  }

  public changeErrorMessage(msg:String) { this._error.next(msg.toString()); }
  
  setAdvEmi(value: string) {
    this.isselect = true
    this.advanceEmi = value;
    // console.log('advanceEmi: ', this.advanceEmi);
    // // var ele = document.getElementById("btn01")
    // ele?.classList.add("btnSelected");
  }
  
  addFilter() {
    var newarr = this.selectedTenure.split('-');
    this.mapSchemeData(newarr, this.schemeData, 'advanceEmi');
  }

  open(content: any) {
    this.modalService.open(content,
      { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult =
          `Dismissed ${this.getDismissReason(reason)}`;
      });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  dcgMaster() {
    const loaderRef = this.modalService.open(LoaderComponent,{
      centered: true,
      animation:true,
      backdrop:'static',
      keyboard: false,
      windowClass:"remove-bg-modal",
     size:"sm",
    // modalDialogClass: " modal-dialog-centered d-flex justify-content-center"
    });
    let token:String = ''; 
    if(this.appData.token){
      token = this.appData.token;
    }
    var obj = {
      'posid': this.authService.userPosId
    };
    this.apiService.dcg(obj, token).subscribe((data: any) => {
      loaderRef.close();
      if(data.length>0){
        this.data = data;
        this.schemeData = data;
        this.cashback();
      }else{
        this.changeErrorMessage("No data found");    
      }
      console.log('dcgdata: ', data);
    }, async (err: any) => {
      loaderRef.close();
      if(err.status == 401){
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
      } else{
        if(err.error.error || err.error.errors){
          //this.errorObj = err.error;
          this.errMsg = err.error.error;
          this.changeErrorMessage(err.error.error);
        }else{
          this.errMsg = err.message;
          //this.errorObj = {error: err.message};
          this.changeErrorMessage(err.message);
        }
      }
    });
  }

  onTenureSelected(value: string) {
    this.selectedTenure = value;
    var newarr = value.split("-");
    this.mapSchemeData(newarr, this.schemeData, '');
    this.resetFilter();
  }

  mapSchemeData(newarr:any, data: any, type: string) {
    var arr: any = [];
    var arrAdvFilter: any = [];
    for (let i = 0; i < data.length; i++) {
      // var advanceEmi = Number(data[i].advance_emi);
      var grossTenure = Number(data[i].tenure);
      console.log('Tenure: ', grossTenure);
      // var grossTenure = grossTenure; //Number(tenure - advanceEmi);
      if (newarr[0] == "0" && newarr.length == 1) {
        arr.push(data[i]);
      }
      else if (grossTenure >= Number(newarr[0]) && grossTenure <= Number(newarr[1])) {
        arr.push(data[i]);
      }
      else if (newarr[0] == "12" && newarr.length == 1) {
        if (grossTenure > 12) {
          arr.push(data[i]);
        }
      }
    }
    if (type == 'advanceEmi') {
      // arrAdvFilter = arr;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].advance_emi == this.advanceEmi) {
          arrAdvFilter.push(data[i]);
        }
      }
      if (arrAdvFilter.length > 0) {
        this.data = arrAdvFilter;
      } else {
        this.data = [];
      }
    }
    
    if (type != 'advanceEmi') {
      if (arr.length > 0) {
        this.data = arr;
      } else {
        this.data = [];
      }
    }
    console.log('data: ', data);
  }


  cashback(){
    var data=  this.data
    for (let i = 0; i < data.length; i++) {
      var cashback = (data[i].oem);
    }
  }
  
  resetFilter() {
    this.advanceEmi = '';
    var newarr = this.selectedTenure.split('-');
    this.mapSchemeData(newarr, this.schemeData, '');
  }

}
