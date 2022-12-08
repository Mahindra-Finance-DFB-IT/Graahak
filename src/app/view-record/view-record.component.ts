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
  selector: 'app-view-record',
  templateUrl: './view-record.component.html',
  styleUrls: ['./view-record.component.css']
})

export class ViewRecordComponent implements OnInit {
  // searchText: string = '';
  // curDate=Date.now();
  reportData:any = [];
  // selectedFileType: string;
  public innerWidth: any;
  appData$ :Observable<AppData>;
  appData:AppData = {}
  @ViewChild(DataTableDirective,{static: true})
  datatableElement: DataTableDirective;
  dtTrigger:Subject<ADTSettings> = new Subject();
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

  ngAfterViewInit(): void {
    let options =  this.getDTOption(this.innerWidth);
    this.dtTrigger.next(options);
  }

  ngOnInit(): void {
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

          that.apiService.getSchemeData(this.reportSearchData, this.appData?.token?.toString() ||'').subscribe((resData:any)=>{
            if (this.reportSearchData.selectReport == 'pcg') {
              resData.data.map((value:any) => {
                value.oem_name = value.oem_name.replace(/_/g, ' ');
              });
            }
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
    if(this.reportSearchForm.value.selectReport == 'pcg'){
      return [
        // {
        //   title: "ID",
        //   data: "id",
        //   // className: "text-wrap",
        //  // width: "100px",
        //   render: (data:any,type:any)=>{
        //     return this.sanitizeText(data) || "-"
        //   }
        // },
        {
          title: "OEM NAME",
          data:"oem_name",
          className: "text_transform",
          render: (data:any,type:any)=>{
            return this.sanitizeText(data) || "-"
          }
        },
        {
          title: "PRODUCT GROUP ID",
          data:"product_group_id",
          //className: "text-wrap",
          render: (data:any,type:any)=>{
            return this.sanitizeText(data) || "-"
          }
        },
        {
          title: "PRODUCT NAME",
          data:"product_name",
          //className: "text-wrap",
          render: (data:any,type:any)=>{
            return this.sanitizeText(data) || "-"
          }
        },
        
        {
          title: "PRODUCT CODE",
          data:"product_code",
          render: (data:any,type:any)=>{
            return this.sanitizeText(data) || "-"
          }
        },
        {
          title: "STATUS ID",
          data:"status_id",
          // className: "text-wrap",
          render: (data:any,type:any)=>{
            return this.sanitizeText(data) || "-"
          }
        },
        {
          title: "STATUS",
          data:"status",
          //className: "text-wrap",
          render: (data:any,type:any)=>{
            return this.sanitizeText(data) || "-"
          }
        }
      ];
    } 
    // if(this.reportSearchForm.value.selectReport == 'master'){
      return [
        // {
        //   title: "ID",
        //   data: "id",
        //   className: "text-wrap",
        //   render: (data:any,type:any)=>{
        //     return this.sanitizeText(data) || "-"
        //   }
        // },
        {
          title: "OEM NAME",
          data:"oem",
          //className: "text-wrap",
          render: (data:any,type:any)=>{
            return this.sanitizeText(data) || "-"
          }
        },
        {
          title: "SCHEME ID",
          data:"scheme_id",
          //className: "text-wrap",
          render: (data:any,type:any)=>{
            return this.sanitizeText(data) || "-"
          }
        },
        {
          title: "SCHEME DESCRIPTION",
          data:"scheme_description",
          //className: "text-wrap",
          render: (data:any,type:any)=>{
            return this.sanitizeText(data) || "-"
          }
        },
        {
          title: "TENURE",
          data:"tenure",
          //className: "text-wrap",
          render: (data:any,type:any)=>{
            return this.sanitizeText(data) || "-"
          }
        },
        {
          title: "SCHEME IRR",
          data:"scheme_irr",
          //className: "text-wrap",
          render: (data:any,type:any)=>{
            return this.sanitizeText(data) || "-"
          }
        },
        {
          title: "ROI",
          data:"roi",
          //className: "text-wrap",
          render: (data:any,type:any)=>{
            return this.sanitizeText(data) || "-"
          }
        },
        {
          title: "ADVANCE EMI",
          data:"advance_emi",
        //  className: "text-wrap",
          render: (data:any,type:any)=>{
            return this.sanitizeText(data) || "-"
          }
        },
        {
          title: "DBD",
          data:"dbd",
          //className: "text-wrap",
          render: (data:any,type:any)=>{
            return this.sanitizeText(data) || "-"
          }
        },
        {
          title: "SCHEME START DATE",
          data:"scheme_start_Date",
          //className: "text-wrap",
          render: (data:any,type:any)=>{
            return this.sanitizeText(data) || "-"
          }
        },
        {
          title: "SCHEME END DATE",
          data:"scheme_end_date",
          //className: "text-wrap",
          render: (data:any,type:any)=>{
            return this.sanitizeText(data) || "-"
          }
        },
        {
          title: "MAX AMOUNT",
          data:"max_amount",
          //className: "text-wrap",
          render: (data:any,type:any)=>{
            return this.sanitizeText(data) || "-"
          }
        },
        {
          title: "MIN AMOUNT",
          data:"min_amount",
          //className: "text-wrap",
          render: (data:any,type:any)=>{
            return this.sanitizeText(data) || "-"
          }
        },
        {
          title: "PROCESSING FEE",
          data:"processing_fee",
          //className: "text-wrap",
          render: (data:any,type:any)=>{
            return this.sanitizeText(data) || "-"
          }
        },
        {
          title: "PORTAL DESCRIPTION",
          data:"portal_description",
          //className: "text-wrap",
          render: (data:any,type:any)=>{
            return this.sanitizeText(data) || "-"
          }
        },
        {
          title: "ACTION",
          data:"action",
          //className: "text-wrap",
          render: (data:any,type:any)=>{
            return this.sanitizeText(data) || "-"
          }
        },
        {
          title: "STATUS",
          data:"status",
        //  className: "text-wrap",
          render: (data:any,type:any)=>{
            return this.sanitizeText(data) || "-"
          }
        },
        {
          title: "SPECIAL SCHEME FLAG",
          data:"special_scheme_flag",
          //className: "text-wrap",
          render: (data:any,type:any)=>{
            return this.sanitizeText(data) || "-"
          }
        },
        {
          title: "IS PF SCHEME",
          data:"is_pf_scheme",
          //className: "text-wrap",
          render: (data:any,type:any)=>{
            return this.sanitizeText(data) || "-"
          }
        },
        {
          title: "PROCESSING FEE PERCENTAGE",
          data:"processing_fee_percentage",
          //className: "text-wrap",
          render: (data:any,type:any)=>{
            return this.sanitizeText(data) || "-"
          }
        },
        {
          title: "MDR PERCENTAGE",
          data:"mdr_percentage",
          //className: "text-wrap",
          render: (data:any,type:any)=>{
            return this.sanitizeText(data) || "-"
          }
        },
        {
          title: "MDR AMOUNT",
          data:"mdr_amount",
          //className: "text-wrap",
          render: (data:any,type:any)=>{
            return this.sanitizeText(data) || "-"
          }
        },
        {
          title: "MBD PERCENTAGE",
          data:"mbd_percentage",
          //className: "text-wrap",
          render: (data:any,type:any)=>{
            return this.sanitizeText(data) || "-"
          }
        },
        {
          title: "MBD AMOUNT",
          data:"mbd_amount",
          //className: "text-wrap",
          render: (data:any,type:any)=>{
            return this.sanitizeText(data) || "-"
          }
        },

        {
          title: "PRODUCT GROUP CODE",
          data:"product_group_code",
          //className: "text-wrap",
          render: (data:any,type:any)=>{
            return this.sanitizeText(data) || "-"
          }
        },
        {
          title: "ACTION SPM FILE",
          data:"action_spm_file",
          //className: "text-wrap",
          render: (data:any,type:any)=>{
            return this.sanitizeText(data) || "-"
          }
        },
        {
          title: "STATUS SPM FILE",
          data:"status_spm_file",
          //className: "text-wrap",
          render: (data:any,type:any)=>{
            return this.sanitizeText(data) || "-"
          }
        },
        {
          title: "DEALER GROUP CODE",
          data:"dealer_group_code",
          //className: "text-wrap",
          render: (data:any,type:any)=>{
            return this.sanitizeText(data) || "-"
          }
        },
        {
          title: "ACTION SDM FILE",
          data:"action_sdm_file",
          //className: "text-wrap",
          render: (data:any,type:any)=>{
            return this.sanitizeText(data) || "-"
          }
        },
        {
          title: "STATUS SDM FILE",
          data:"status_sdm_file",
          //className: "text-wrap",
          render: (data:any,type:any)=>{
            return this.sanitizeText(data) || "-"
          }
        }
      ];
    // }
  }

  sanitizeText(text: string){
    return text;
  }
}
