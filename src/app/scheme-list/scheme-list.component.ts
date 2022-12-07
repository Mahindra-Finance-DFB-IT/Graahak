import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { ApiService } from '../service/api.service';
import { AppData } from '../models/app';
import { AuthService } from '../service/auth.service';
import { LoaderComponent } from '../loader/loader.component';
import { LogoutComponent } from '../logout.component';
import { SchemeModel, LoginType } from '../_models/app';

@Component({
  selector: 'scheme-list',
  templateUrl: './scheme-list.component.html',
  styleUrls: ['./scheme-list.component.css']
})

export class SchemeListComponent implements OnInit {
  [x: string]: any;
  selectedTenure = "0";
  closeResult = '';
  appData$: Observable<AppData>;
  appData: AppData = {};
  
  @ViewChild(DataTableDirective, { static: true })
  isselect: boolean = false;
  isCashBackApplied:boolean = false;
  data: Array<SchemeModel>;
  errMsg: string;
  // searchText: string = '';
  advanceEmi: any;
  schemeData: Array<SchemeModel> = [];

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
    this.authService.searchText = '';
    this.fetchSchemeList();
  }

  setAdvEmi(value: string) {
    this.isselect = true
    this.advanceEmi = value;
  }
  
  addFilter() {
    var newarr = this.selectedTenure.split('-');
    this.mapSchemeData(newarr, this.schemeData, 'advanceEmi', '');
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

  fetchSchemeList() {
    const loaderRef = this.modalService.open(LoaderComponent,{
      centered: true,
      animation:true,
      backdrop:'static',
      keyboard: false,
      windowClass:"remove-bg-modal",
      size:"sm"
    });
    let token:String = ''; 
    if(this.appData.token){
      token = this.appData.token;
    }
    var sessionData = this.authService.getData();
    var obj = {
      'posid': (sessionData?.loginType == LoginType.SALESEXECUTIVE) ? sessionData?.salesExecutive?.posId : '',
    };
    this.apiService.getSchemes(obj, token).subscribe((data: any) => {
      loaderRef.close();
      
      if (data) {
        // console.log(data);
        data.schemeMaster.map((schemeValue: SchemeModel) => {
          schemeValue.pname = '';
          data.schemePcg.forEach((pcgValue: any) => {
            if (pcgValue.product_group_id == schemeValue.product_group_code) {
              schemeValue.pname += pcgValue.product_name + ' | ';
            }
          });
        });
          
        this.data = data.schemeMaster;
        this.schemeData = data.schemeMaster;
        // console.log(this.schemeData);
        console.log(this.data.length);
      } else {
        this.errMsg = "No data found";
      }
    }, async (err: any) => {
      loaderRef.close();
      if(err.status == 401){
        const logoutModalRef =  await this.modalService.open(LogoutComponent,{
          centered: true,
          animation:true,
          backdrop:'static',
          keyboard: false,
          size:"sm",
        });
        logoutModalRef.closed.subscribe(_d=>{
          console.log(err);
          this.authService.logout();
          this.route.navigate(['/login']);
          return false;
        });
      } else {
        if (err.error.error || err.error.errors) {
          this.errMsg = err.error.error;
        } else {
          this.errMsg = err.message;
        }
      }
    });
  }

  onTenureSelected(value: string) {
    this.selectedTenure = value;
    var newarr = value.split("-");
    this.mapSchemeData(newarr, this.schemeData, '', '');
    this.resetFilter();
  }

  searchData(data: any) {
    this.authService.searchText = data.target.value;
    var newarr = this.selectedTenure.split('-');
    // console.log(this.authService.searchText.toLowerCase());
    this.mapSchemeData(newarr, this.schemeData, 'text', this.authService.searchText.toLowerCase());
  }

  mapSchemeData(newarr:any, data: any, type: string, searchStr: string) {
    var arr: Array<SchemeModel> = [];
    var arrAdvFilter: Array<SchemeModel> = [];
    if (newarr && newarr.length > 0) {
      for (let i = 0; i < data.length; i++) {
        var grossTenure = Number(data[i].tenure);
        if (newarr[0] == "0" && newarr.length == 1) {
          arr.push(data[i]);
        } else if (grossTenure >= Number(newarr[0]) && grossTenure <= Number(newarr[1])) {
          arr.push(data[i]);
        } else if (newarr[0] == "12" && newarr.length == 1) {
          if (grossTenure > 12) {
            arr.push(data[i]);
          }
        }
      }
    }
    // console.log(arr);
    if (type == 'text') {
      var arr2 = arr.filter((value) =>{
        return (value.oem.toLowerCase().includes(searchStr) || value.pname.toLowerCase().includes(searchStr));
      });
      arr = arr2;
    }
    // console.log(arr);
    // if (type == 'advanceEmi') {
      if (this.advanceEmi) {
        var arr2 = arr.filter((value) =>{
          return (value.advance_emi == this.advanceEmi);
        });
        arr = arr2;
        // for (let i = 0; i < arr.length; i++) {
        //   if (arr[i].advance_emi == this.advanceEmi) {
        //     arrAdvFilter.push(data[i]);
        //   }
        // }
      }
      if (this.isCashBackApplied == true) {
        var arr2 = arr.filter((value) =>{
          return (value.oem.toLowerCase() != 'mmfsl');
        });
        arr = arr2;
        // if (arrAdvFilter && arrAdvFilter.length > 0) {
        //   arrAdvFilter = arrAdvFilter.filter(value => value.oem.toLowerCase() != 'mmfsl');
        // } else {
        //   arrAdvFilter = arr.filter(value => value.oem.toLowerCase() != 'mmfsl');
        // }
      }
      // if (arrAdvFilter.length > 0) {
      //   this.data = arrAdvFilter;
      // } else if (!this.advanceEmi && !this.isCashBackApplied) {
        // this.data = arr;
      // } else {
      //   this.data = []; 
      // }
    // }
    
    // if (type != 'advanceEmi') {
      if (arr.length > 0) {
        this.data = arr;
      } else {
        this.data = [];
      }
    // }
    console.log('data: ', this.data.length);
  }
  
  resetFilter() {
    this.advanceEmi = '';
    this.isCashBackApplied = false;
    var newarr = this.selectedTenure.split('-');
    this.mapSchemeData(newarr, this.schemeData, '', '');
  }
}
