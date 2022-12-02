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
  selector: 'app-upload-data',
  templateUrl: './upload-data.component.html',
  styleUrls: ['./upload-data.component.css']
})

export class UploadDataComponent implements OnInit {
  searchText: string = '';
  curDate=Date.now();
  reportData:any = [];
  selectedFileType: string;
  public innerWidth: any;
  appData$ :Observable<AppData>;
  appData:AppData = {}
  @ViewChild(DataTableDirective,{static: true})
  datatableElement: DataTableDirective;
  dtTrigger:Subject<ADTSettings> = new Subject();
  showOtpScreen= false;
  otherDetails = false;
  reportSearchData:ReportSearchData = {
    selectReport: 'all#all',
    searchData: ''
  };
  reportSearchForm = new FormGroup({
    selectReport: new FormControl(this.reportSearchData?.selectReport),
    searchData: new FormControl(this.reportSearchData.searchData)
  });
  scheduleData:any = null;
  constructor(
              private modalService: NgbModal,
              private apiService: ApiService,
              public router:Router,
              private authService:AuthService,
              private store: Store<{ appItem: AppData }>) {
    const state:any = this.router.getCurrentNavigation()?.extras.state;
    if(!state?.loginSuccess){
      //this.router.navigateByUrl("/home");
     // return;
    }


    this.appData$ = store.select('appItem');
    this.appData$.subscribe((obj:AppData)=>{
      this.appData = obj;


      // this.apiService.getScheduleData(this.appData.token||'').subscribe(data=>{
      //   this.scheduleData = data;
      // })

    })
  }
  ngAfterViewInit(): void {
    let options =  this.getDTOption(this.innerWidth);
    //console.log(options);
    this.dtTrigger.next(options);
  }

  ngOnInit(): void {
    this.selectedFileType = 'pcg';  
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

    /*$.fn['dataTable'].ext.search.push((settings: any,data: any,dataIndex: any)=>{
      console.log(settings);
      console.log(data);
      console.log(dataIndex);
    })*/
  }

  ngOnDestroy(){
    this.dtTrigger.unsubscribe();
  }

  getDTOption(innerWidth: Number){
    let dtOptions: DataTables.Settings = {};
    // if(innerWidth < 600){
    //   dtOptions  =  this._getDTOption("");
    // }else{
      dtOptions =  this._getDTOption( this. selectedFileType);
    // }
    return dtOptions;
  }

  keyPressNumeric(e:any) {
    if (!isNaN(e.key)) {
      return true;
    }
    return false;
  }

  _getDTOption(type: string){
    const that = this;

    let responsiveTag = {};

    /*if(responsive){
      responsiveTag = {
        scrollY: "400px",
        deferRender: true,
        scrollCollapse: true,
        scroller: true,
        paging: true,
      }
    }*/

    let cols = this._getColumns();
    
    return {
      //paging: true,
      autoWidth:false,
      columnDefs: [
        { responsivePriority: 2, targets: 0 },
        { responsivePriority: 10001, targets: 4 },
        { responsivePriority: 0, targets: 0 }
      ],
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
          //let reportSearchData: ReportSearchData = {};
          
          this.reportSearchData.limit = dataTableParameters?.length;
          this.reportSearchData.offset = dataTableParameters?.start;
          this.reportSearchData.draw = dataTableParameters?.draw;
          //console.log(this.reportSearchData);
          //
          this.selectedFileType = type;
          console.log('selectedFileType: ',type);
          that.apiService.getSchemeData (type, this.reportSearchData, this.appData?.token?.toString() ||'').subscribe((resData:any)=>{
            that.reportData = resData.data;
            //console.log(resData.data);
            callback(resData)
          },async (err:any)=>{
            console.log(err);
            // const logoutModalRef =  await this.modalService.open(LogoutComponent,{
            //   centered: true,
            //   animation:true,
            //   backdrop:'static',
            //   keyboard: false,
            //   size:"sm",
            // });
            // logoutModalRef.closed.subscribe(_d=>{
            //   //console.log(err);
            //   this.authService.logout();
            //   this.router.navigate(['/login']);
            //   return false;
            // })
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
    if(this. selectedFileType == 'pcg'){
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
            title: "OEM_NAME",
            data:"oem_name",
            //className: "text-wrap",
            //width: "100px",
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

    // if(this.reportSearchData.selectReport == "mandate#initial_mandate" || 
    //    this.reportSearchData.selectReport == "mandate#rejected_mandate"){
    //     return [
    //       {
    //         title: "Customer Name",
    //         data: "customer_name",
    //         className: "text-wrap",
    //         render: (data:any,type:any)=>{
    //           return this.sanitizeText(data) || "-"
    //         }
    //       },
    //       {
    //         title: "Mobile Number",
    //         data:"mobile_number",
    //         //className: "text-wrap",
    //         render: (data:any,type:any)=>{
    //           return this.sanitizeText(data) || "-"
    //         }
    //       },
    //       {
    //         title: "Loan Limit",
    //         data:"loan_limit",
    //         //className: "text-wrap",
    //         render: (data:any,type:any)=>{
    //           return this.sanitizeText(data) || "-"
    //         }
    //       },
    //       {
    //         title: "Rejection Type",
    //         data:"rejection_type",
    //         //className: "text-wrap",
    //         render: (data:any,type:any)=>{
    //           return this.sanitizeText(data) || "-"
    //         }
    //       },
    //       {
    //         title: "Rejection Reason",
    //         data:"rejection_reason",
    //         class: 'none',
    //         //className: "text-wrap",
    //         render: (data:any,type:any)=>{
    //           return this.sanitizeText(data) || "-"
    //         }
    //       },
    //       {
    //         title: "Bank",
    //         data:"bank",
    //         //className: "text-wrap",
    //         render: (data:any,type:any)=>{
    //           return this.sanitizeText(data) || "-"
    //         }
    //       },
    //       {
    //         title: "IFSC",
    //         data:"ifsc",
    //         //className: "text-wrap",
    //         render: (data:any,type:any)=>{
    //           return this.sanitizeText(data) || "-"
    //         }
    //       },
    //       {
    //         title: "Account Number",
    //         data:"account_number",
    //         class: 'none',
    //         //className: "text-wrap",
    //         render: (data:any,type:any)=>{
    //           return this.sanitizeText(data) || "-"
    //         }
    //       },
    //       {
    //         title: "Dealer Name",
    //         data:"vas_dealer",
    //         class: 'none',
    //         //className: "text-wrap",
    //         render: (data:any,type:any)=>{
    //           return this.sanitizeText(data) || "-"
    //         }
    //       },
    //       {
    //         title: "Last Mandate Upload Date",
    //         data:"last_mandate_upload_date",
    //         class: 'none',
    //         //className: "text-wrap",
    //         /*render: (data:any,type:any)=>{
    //           if ( type === 'display' && data) {
    //               return this.formateDate(data);
    //           }
    //           return this.sanitizeText(data) || "-"
    //         }*/
    //         render: (data:any,type:any)=>{
    //           return this.sanitizeText(data) || "-"
    //         }
    //       },
    //       {
    //         title: "SE Mobile Number",
    //         data:"vas_fos_number",
    //         class: 'none',
    //         //className: "text-wrap",
    //         render: (data:any,type:any)=>{
    //           return this.sanitizeText(data) || "-"
    //         }
    //       }
    //     ]
    //    }
else{
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
          if ( type === 'display' && data) {
             return this.statusText(data);
          }        
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
        title: "MAX AMOUNT  ",
        data:"max_amount",
        //className: "text-wrap",
        render: (data:any,type:any)=>{
          return this.sanitizeText(data) || "-"
        }
      },
      {
        title: "Min AMOUNT  ",
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
        title: " STATUS",
        data:"status",
      //  className: "text-wrap",
        render: (data:any,type:any)=>{
          return this.sanitizeText(data) || "-"
        }
      },
      {
        title: "SPECAL SCHEME FLAG",
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
        title: "PRODUCT GROUP CODE  ",
        data:"product_group_code",
        //className: "text-wrap",
        render: (data:any,type:any)=>{
          return this.sanitizeText(data) || "-"
        }
      },
      {
        title: "ACTION SPM FILE ",
        data:"action_spm_file",
        //className: "text-wrap",
        render: (data:any,type:any)=>{
          return this.sanitizeText(data) || "-"
        }
      },
      {
        title: " STATUS SPM FILE",
        data:"status_spm_file",
        //className: "text-wrap",
        render: (data:any,type:any)=>{
          return this.sanitizeText(data) || "-"
        }
      },
      {
        title: "DEALER GROUP CODE ",
        data:"dealer_group_code",
        //className: "text-wrap",
        render: (data:any,type:any)=>{
          return this.sanitizeText(data) || "-"
        }
      },
      {
        title: "ACTION SDM FILE ",
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

    ]

  }
  }
  sanitizeText(text: string){
    return text;
  }

  statusText(data: string){
      var str = data.toLowerCase(); // cast numbers
      let rdata='';
      switch(str){
        case 'active':
          rdata = '<span class="text-success fw-bold">'+data+'</span>';
        break;
        case 'rejected':
          rdata = '<span class="text-danger fw-bold">'+data+'</span>';
        break;
        case 'awaiting confirmation':
          rdata = '<span class="text-warning fw-bold">'+data+'</span>';
        break;
      }
      return rdata;
    
  }

  formateDate(data: string){
    const d = new Date(data);
    const dformat = [d.getFullYear(),
      d.getMonth()+1,
      d.getDate()
      ].join('-')+' '+
      [d.getHours(),
      d.getMinutes(),
      d.getSeconds()].join(':');
    return dformat ;

  }
}
