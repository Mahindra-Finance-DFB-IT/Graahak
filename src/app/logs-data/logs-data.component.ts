import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { Observable, Subject } from 'rxjs';
import { LoginType, MONTHS, ReportSearchData } from '../models/app';
import { ApiService } from '../service/api.service';
import { AppData } from 'src/app/models/app';
import { Store } from '@ngrx/store';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LogoutComponent } from '../logout.component';
import { AuthService } from '../service/auth.service';
import { String } from 'lodash';

@Component({
  selector: 'app-logs-data',
  templateUrl: './logs-data.component.html',
  styleUrls: ['./logs-data.component.css']
})
export class LogsDataComponent implements OnInit {
  longText = `Api Name`;
  // searchText: string = '';
  // curDate=Date.now();
  selectRecord: any = 'user_logs';
  reportData:any = [];
  // selectedFileType: string;
  public innerWidth: any;
  appData$ :Observable<AppData>;
  appData:AppData = {}
  userLogs: any = [];
  nameMatch: any = [];
  scheduleData: any = [];
  @ViewChild(DataTableDirective,{static: true})
  datatableElement: DataTableDirective;
  dtTrigger:Subject<ADTSettings> = new Subject();
  // showOtpScreen= false;
  // otherDetails = false;
  // reportSearchData:ReportSearchData = {
  //   selectReport: 'user_logs',
  //   searchData: ''
  // };
  // reportSearchForm = new FormGroup({
  //   selectReport: new FormControl(this.reportSearchData?.selectReport),
  //   searchData: new FormControl(this.reportSearchData.searchData)
  // });
  userArray: any;
  // scheduleData:any = null;

 // searchText: string = '';
  // curDate=Date.now();
 
  // showOtpScreen= false;
  // otherDetails = false;
  reportSearchData:ReportSearchData = {
    selectReport: 'master',
    searchData: ''
  };
  reportSearchForm = new FormGroup({
    selectReport: new FormControl(this.reportSearchData?.selectReport),
    searchData: new FormControl(this.reportSearchData.searchData)
  });
  // scheduleData:any = null;


  
  constructor(
    private modalService: NgbModal,
    private apiService: ApiService,
    public router:Router,
    private authService:AuthService,
    private store: Store<{ appItem: AppData }>) {
    const state:any = this.router.getCurrentNavigation()?.extras.state;
    // if(!state?.loginSuccess){
      //this.router.navigateByUrl("/home");
     // return;
    // }
    this.appData$ = store.select('appItem');
    this.appData$.subscribe((obj:AppData)=>{
      this.appData = obj;
      // this.apiService.getScheduleData(this.appData.token||'').subscribe(data=>{
      //   this.scheduleData = data;
      // })
    });
  }

  setOption(recordType: string) {
    this.selectRecord = recordType;
    this.reportSearchForm.value.selectReport = recordType;
  }




  ngAfterViewInit(): void {
    let options =  this.getDTOption(this.innerWidth);
    this.dtTrigger.next(options);
  }

  ngOnInit(): void {
    this.getData();
    // this.selectedFileType = 'master';  
    this.innerWidth = window.innerWidth;
    this.reportSearchForm.valueChanges.subscribe(data=>{
      this.reportSearchData = {
        selectReport : data.selectReport?.toString(),
        searchData : data.searchData?.toString()
      }
      this.datatableElement.dtInstance.then((dtInstance: DataTables.Api)=>{
        const options = this.getDTOption(this.innerWidth);
        //console.log(options);
        //console.log(dtInstance);
        dtInstance.clear();
        dtInstance.destroy();
        this.dtTrigger.next(options);
      })
    },(err)=>console.log(err));
  }

  ngOnDestroy(){
    this.dtTrigger.unsubscribe();
  }

  openSection() {
    this.router.navigateByUrl("/file-upload");
  }

  getDTOption(innerWidth: Number){
    console.log(this.reportSearchForm.value.selectReport);
    let dtOptions: DataTables.Settings = {};
    dtOptions =  this._getDTOption();
    return dtOptions;
  }

  keyPressNumeric(e:any) {
    if (!isNaN(e.key)) {
      return true;
    }
    return false;
  }

  _getDTOption(){
    const that = this;
    let responsiveTag = {};
    let cols = this._getColumns();
    // var selectedReport: any = this.reportSearchForm.value.selectReport;
    return {
      //paging: true,
      autoWidth:false,
      // columnDefs: [
      //   { responsivePriority: 2, targets: 0 }
      //   // { responsivePriority: 10001, targets: 4 },
      //   // { responsivePriority: 0, targets: 0 }
      // ],
      language: {
        paginate: {
          first: '<i class="bi bi-chevron-double-right"></i>',
          last: '<i class="bi bi-chevron-double-left"></i>',
          next: '<i class="bi bi-chevron-right"></i>',
          previous: '<i class="bi bi-chevron-left"></i>' 
        }
      },
      serverSide: true,
      processing: true,
      pageLength:50,
      ajax: (dataTableParameters: any,callback: any)=>{
          
          this.reportSearchData.limit = dataTableParameters?.length;
          this.reportSearchData.offset = dataTableParameters?.start;
          this.reportSearchData.draw = dataTableParameters?.draw;

          that.apiService.getLogData(this.reportSearchData, this.appData?.token?.toString() ||'').subscribe((resData:any)=>{
            resData.data.map((value:any, index: any) => {
              value.id = ++index;
            });
            console.log(resData.data);
            that.reportData = resData.data;
            callback(resData)
          },async (err:any)=>{
            // console.log(err);
            const logoutModalRef = await this.modalService.open(LogoutComponent,{
              centered: true,
              animation:true,
              backdrop:'static',
              keyboard: false,
              size:"sm",
            });
            logoutModalRef.closed.subscribe(_d=>{
              //console.log(err);
              this.authService.logout();
              this.router.navigate(['/admin-login']);
              return false;
            })
          })
      },
      columns: cols,
      ordering: false,
      searching: false,
      responsive: true,
      lengthChange: false,
      ...responsiveTag
    }
  }

  _getColumns(){

      return [
        {
          title: "ID",
          data: "id",
          // className: "text-wrap",
         // width: "100px",
          render: (data:any,type:any)=>{
            return this.sanitizeText(data) || "-"
          }
        },
        {
          title: "username",
          data:"username",
          className: "text_transform",
          render: (data:any,type:any)=>{
            return this.sanitizeText(data) || "-"
          }
        },
        {
          title: "Role",
          data:"role",
          //className: "text-wrap",
          render: (data:any,type:any)=>{
            return this.sanitizeText(data) || "-"
          }
        },
        {
          title: "Date",
          data:"date",
          //className: "text-wrap",
          render: (data:any,type:any)=>{
            return this.sanitizeText(data) || "-"
          }
        },
        
       
      ];
    } 
   
  

  sanitizeText(text: string){
    return text;
  }

  getData() {
    this.apiService.getData(this.selectRecord, this.appData?.token?.toString() ||'').subscribe((resData:any)=>{
      this.userLogs = resData.userLogs;
      this.userLogs.forEach((value: any) => {
        value.name = '';
        if (value.api_name == 'admin-login' || value.api_name == 'adminLogin') {
          value.name = 'Admin Login'; 
        }
        if (value.api_name == "getSchemes") {
          value.name = "Get Schemes"; 
        }
        if (value.api_name == "uploadPcg") {
          value.name = 'Upload Pcg'; 
        }
        if (value.api_name == "getSchemeDetail") {
          value.name = "Get SchemeDetail"; 
        }
        if (value.api_name == "getSchemeData") {
          value.name = 'Get SchemeData'; 
        }
        if (value.api_name == "smRsmLogin" ) {
          value.name = 'Sm/Rsm Login'; 
        }
        if (value.api_name == "uploadMaster") {
          value.name = 'Upload Scheme Master'; 
        }
        if (value.api_name == "getReport") {
          value.name = "Get Report"; 
        }
        if (value.api_name == "getCustomerDetails") {
          value.name = "Get Customer Details" 
        }
        if (value.api_name == "sendOtpSmRsm") {
          value.name = "Send Otp Sm/Rsm" 
        }

        if (value.api_name == "resendOtpSmRsm") {
          value.name = 'Resend Otp Sm/Rsm'; 
        }
        if (value.api_name == "verifyOtpSmRsm" ) {
          value.name = 'verify Otp Sm/Rsm'; 
        }
        if (value.api_name == "seLogin") {
          value.name = 'Se Login'; 
        }
        if (value.api_name == "seResendOtp") {
          value.name = "Se Resend Otp"; 
        }
        if (value.api_name == "Se Verify Otp") {
          value.name = "Get Customer Details" 
        }
        if (value.api_name == "uploadDcg") {
          value.name = "Upload Dcg" 
        }
      });
      console.log('resData.userLogs: ', resData.userLogs);
      this.userLogs = resData.userLogs;
      this.nameMatch = resData.nameMatch;
      this.scheduleData = resData.scheduleData;
    },async (err:any)=>{
      // console.log(err);  
     
     
    })
  }
  getApiData(name:any){
console.log("=====>",name);
  }
}

  


  


