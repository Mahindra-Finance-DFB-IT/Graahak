import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { Observable, Subject } from 'rxjs';
import { ReportSearchData } from '../models/app';
import { ApiService } from '../service/api.service';
import { AppData } from 'src/app/models/app';
import { Store } from '@ngrx/store';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LogoutComponent } from '../logout.component';
import { AuthService } from '../service/auth.service';
import { LoaderComponent } from '../loader/loader.component';
import { Chart } from 'chart.js/auto';
import { String } from 'lodash';

@Component({
  selector: 'app-logs-data',
  templateUrl: './logs-data.component.html',
  styleUrls: ['./logs-data.component.css']
})
export class LogsDataComponent implements OnInit, AfterViewInit {
  selectRecord: any = 'user_logs';
  selectedApi: string;
  reportData:any = [];
  public innerWidth: any;
  appData$ :Observable<AppData>;
  appData:AppData = {};
  userLogs: any = [];
  nameMatch: any = [];
  scheduleData: any = [];
  @ViewChild(DataTableDirective,{static: true})
  datatableElement: DataTableDirective;
  dtTrigger:Subject<ADTSettings> = new Subject();
  reportSearchData:ReportSearchData = {
    selectReport: 'test',
    searchData: ''
  };
  reportSearchForm = new FormGroup({
    selectReport: new FormControl(this.reportSearchData?.selectReport),
    searchData: new FormControl(this.reportSearchData.searchData)
  });
  
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
    if (recordType == 'name_match') {
      this.getApiData('name_match');
    }
    if (recordType == 'user_logs') {
      this.selectedApi = '';
    }
  }

  getApiData(apiName:any){
    this.selectedApi = apiName;
    this.reportSearchForm.value.selectReport = apiName;
    this.reportSearchForm.updateValueAndValidity();
  }

  ngAfterViewInit(): void {
    let options =  this.getDTOption(this.innerWidth);
    this.dtTrigger.next(options);
  }

  ngOnInit(): void {
    this.getData();
    this.innerWidth = window.innerWidth;
    this.reportSearchForm.valueChanges.subscribe(data=>{
      this.reportSearchData = {
        selectReport : this.selectedApi,
        searchData : data.searchData?.toString()
      }
      this.datatableElement.dtInstance.then((dtInstance: DataTables.Api)=>{
        const options = this.getDTOption(this.innerWidth);
        dtInstance.clear();
        dtInstance.destroy();
        this.dtTrigger.next(options);
      })
    },(err)=>console.log(err));
  }

  ngOnDestroy(){
    this.dtTrigger.unsubscribe();
  }

  getDTOption(innerWidth: Number){
    let dtOptions: DataTables.Settings = {};
    dtOptions =  this._getDTOption();
    return dtOptions;
  }

  _getDTOption(){
    const that = this;
    let responsiveTag = {};
    let cols = this._getColumns();
    return {
      autoWidth:false,
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
          // console.log(resData.data);
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
    if (this.selectRecord == 'user_logs') {
      return [
        {
          title: "Id",
          data: "id",
          // className: "text-wrap",
          // width: "100px",
          render: (data:any,type:any)=>{
            return this.sanitizeText(data) || "-"
          }
        },
        {
          title: "User Id/Mobile Number",
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
        }
      ];
    }
    return [
      {
        title: "Id",
        data: "id",
        // className: "text-wrap",
        // width: "100px",
        render: (data:any,type:any)=>{
          return this.sanitizeText(data) || "-"
        }
      },
      {
        title: "Count",
        data:"cnt",
        className: "text_transform",
        render: (data:any,type:any)=>{
          return this.sanitizeText(data) || "-"
        }
      },
      {
        title: "Date",
        data:"Count",
        //className: "text-wrap",
        render: (data:any,type:any)=>{
          return this.sanitizeText(data) || "-"
        }
      }
    ];
    
  } 

  sanitizeText(text: string){
    return text;
  }

  getData() {
    const loaderRef = this.modalService.open(LoaderComponent,{
      centered: true,
      animation:true,
      backdrop:'static',
      keyboard: false,
      windowClass:"remove-bg-modal",
      size:"sm",
    });
    this.apiService.getData(this.appData?.token?.toString() ||'').subscribe((resData:any)=>{
      loaderRef.close();
      this.userLogs = resData.userLogs;
      this.userLogs.forEach((value: any) => {
        value.name = '';
        if (value.api_name == 'admin-login' || value.api_name == 'adminLogin') {
          value.name = 'Admin Login'; 
        }
        if (value.api_name == "getSchemes") {
          value.name = "Get Scheme List"; 
        }
        if (value.api_name == "uploadPcg") {
          value.name = 'Upload Pcg'; 
        }
        if (value.api_name == "getSchemeDetail") {
          value.name = "Get Scheme Details"; 
        }
        if (value.api_name == "getSchemeData") {
          value.name = 'View Schemes-Admin'; 
        }
        if (value.api_name == "smRsmLogin" ) {
          value.name = 'Login Sm/Rsm'; 
        }
        if (value.api_name == "uploadMaster" || value.api_name == 'uploadms') {
          value.name = 'Upload Scheme Master'; 
        }
        if (value.api_name == "getReport") {
          value.name = "Get SE Report"; 
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
          value.name = 'Verify Otp Sm/Rsm'; 
        }
        if (value.api_name == "seLogin") {
          value.name = 'Login SE'; 
        }
        if (value.api_name == "seVerifyOtp") {
          value.name = "Verify Otp SE"; 
        }
        if (value.api_name == "seResendOtp") {
          value.name = "Resend Otp SE"; 
        }
        if (value.api_name == "Se Verify Otp") {
          value.name = "Get Customer Details" 
        }
        if (value.api_name == "uploadDcg") {
          value.name = "Upload Dcg" 
        }
      });
      this.userLogs = resData.userLogs;
      this.nameMatch = resData.nameMatch;
      this.scheduleData = resData.scheduleData;
      let data: any,
      optionsChart: any,
      chart: any,
      ctx: any = document.getElementById('areaChart') as HTMLElement;

      data = {
        labels: this.getGraphData(this.nameMatch, 'labels'),
        datasets: [
          {
            label: 'API Hits',
            data: this.getGraphData(this.nameMatch, 'count'),
            backgroundColor: '#eb193578',
            borderColor: '#EB1935',
            fill: true,
            lineTension: 0,
            radius: 5,
          }
        ],
      };

      optionsChart = {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          position: 'top',
          text: 'Apples to Oranasdasdasdes',
          fontSize: 12,
          fontColor: '#666',
        },
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            fontColor: '#999',
            fontSize: 14,
          },
        },
      };

      chart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: optionsChart,
      });
    },async (err:any)=>{
      loaderRef.close();
    })
  }

  getGraphData(nameMatch: Array<[]>, type: string) {
    var arr: any = [];
    if (type == 'labels') {
      nameMatch.forEach((element: any, index: number) => {
        index < 10 ? arr.push(element.Count) : '';
      });
    } else {
      nameMatch.forEach((element: any, index: number) => {
        index < 10 ? arr.push(element.cnt) : '';
      });
    }
    return arr;
  }
}
