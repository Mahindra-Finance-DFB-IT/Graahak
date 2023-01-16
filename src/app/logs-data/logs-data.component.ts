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
    //   this.nameMatch = [
    //     {
    //         "Count": "2023-01-11",
    //         "cnt": 480
    //     },
    //     {
    //         "Count": "2023-01-10",
    //         "cnt": 1592
    //     },
    //     {
    //         "Count": "2023-01-09",
    //         "cnt": 1599
    //     },
    //     {
    //         "Count": "2023-01-08",
    //         "cnt": 1098
    //     },
    //     {
    //         "Count": "2023-01-07",
    //         "cnt": 1249
    //     },
    //     {
    //         "Count": "2023-01-06",
    //         "cnt": 1388
    //     },
    //     {
    //         "Count": "2023-01-05",
    //         "cnt": 1509
    //     },
    //     {
    //         "Count": "2023-01-04",
    //         "cnt": 1287
    //     },
    //     {
    //         "Count": "2023-01-03",
    //         "cnt": 1559
    //     },
    //     {
    //         "Count": "2023-01-02",
    //         "cnt": 1790
    //     },
    //     {
    //         "Count": "2023-01-01",
    //         "cnt": 1918
    //     },
    //     {
    //         "Count": "2022-12-31",
    //         "cnt": 1380
    //     },
    //     {
    //         "Count": "2022-12-30",
    //         "cnt": 1212
    //     },
    //     {
    //         "Count": "2022-12-29",
    //         "cnt": 1191
    //     },
    //     {
    //         "Count": "2022-12-28",
    //         "cnt": 1165
    //     },
    //     {
    //         "Count": "2022-12-27",
    //         "cnt": 1145
    //     },
    //     {
    //         "Count": "2022-12-26",
    //         "cnt": 1514
    //     },
    //     {
    //         "Count": "2022-12-25",
    //         "cnt": 417
    //     },
    //     {
    //         "Count": "2022-12-24",
    //         "cnt": 1173
    //     },
    //     {
    //         "Count": "2022-12-23",
    //         "cnt": 919
    //     },
    //     {
    //         "Count": "2022-12-22",
    //         "cnt": 1188
    //     },
    //     {
    //         "Count": "2022-12-21",
    //         "cnt": 1279
    //     },
    //     {
    //         "Count": "2022-12-20",
    //         "cnt": 1262
    //     },
    //     {
    //         "Count": "2022-12-19",
    //         "cnt": 1456
    //     },
    //     {
    //         "Count": "2022-12-18",
    //         "cnt": 1310
    //     },
    //     {
    //         "Count": "2022-12-17",
    //         "cnt": 1204
    //     },
    //     {
    //         "Count": "2022-12-16",
    //         "cnt": 1300
    //     },
    //     {
    //         "Count": "2022-12-15",
    //         "cnt": 1363
    //     },
    //     {
    //         "Count": "2022-12-14",
    //         "cnt": 1269
    //     },
    //     {
    //         "Count": "2022-12-13",
    //         "cnt": 1327
    //     },
    //     {
    //         "Count": "2022-12-12",
    //         "cnt": 1534
    //     },
    //     {
    //         "Count": "2022-12-11",
    //         "cnt": 1244
    //     },
    //     {
    //         "Count": "2022-12-10",
    //         "cnt": 1299
    //     },
    //     {
    //         "Count": "2022-12-09",
    //         "cnt": 1310
    //     },
    //     {
    //         "Count": "2022-12-08",
    //         "cnt": 1270
    //     },
    //     {
    //         "Count": "2022-12-07",
    //         "cnt": 1252
    //     },
    //     {
    //         "Count": "2022-12-06",
    //         "cnt": 1333
    //     },
    //     {
    //         "Count": "2022-12-05",
    //         "cnt": 1424
    //     },
    //     {
    //         "Count": "2022-12-04",
    //         "cnt": 1258
    //     },
    //     {
    //         "Count": "2022-12-03",
    //         "cnt": 1269
    //     },
    //     {
    //         "Count": "2022-12-02",
    //         "cnt": 1264
    //     },
    //     {
    //         "Count": "2022-12-01",
    //         "cnt": 1101
    //     },
    //     {
    //         "Count": "2022-11-30",
    //         "cnt": 998
    //     },
    //     {
    //         "Count": "2022-11-29",
    //         "cnt": 1061
    //     },
    //     {
    //         "Count": "2022-11-28",
    //         "cnt": 1054
    //     },
    //     {
    //         "Count": "2022-11-27",
    //         "cnt": 1117
    //     },
    //     {
    //         "Count": "2022-11-26",
    //         "cnt": 1039
    //     },
    //     {
    //         "Count": "2022-11-25",
    //         "cnt": 963
    //     },
    //     {
    //         "Count": "2022-11-24",
    //         "cnt": 1198
    //     },
    //     {
    //         "Count": "2022-11-23",
    //         "cnt": 1127
    //     }
    // ];
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
