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
@Component({
  selector: 'emi-home',
  templateUrl: './emi-home.component.html',
  styleUrls: ['./emi-home.component.css']
})
export class EmiHomeComponent implements OnInit {

  [x: string]: any;
  isBttonShow = false;
  selval = "0";
  closeResult = '';
  curDate = Date.now();
  reportData: any = [];
  public innerWidth: any;
  appData$: Observable<AppData>;
  appData: AppData = {}
  @ViewChild(DataTableDirective, { static: true })
  datatableElement: DataTableDirective;
  dtTrigger: Subject<ADTSettings> = new Subject();
  showOtpScreen = false;
  otherDetails = false;
  isselect = false
  data: any;
  searchText: '';
  btnvalue: any;
  schemeData: any
  pcgdata: any;
  constructor(

    public apiService: ApiService,
    public http: HttpClient,
    private modalService: NgbModal,
    private authService: AuthService,
  ) { }


  ngOnInit(): void {
  
    this.dcgMaster();

  }
  btncl(btnval: any) {
    this.isselect = true
    this.btnvalue = btnval;
    console.log('btnvalue: ', this.btnvalue);
    var ele = document.getElementById("btn01")
    ele?.classList.add("btnSelected");


  }
  apply(tenval: any) {
    var val = tenval.value;
    //  var val1 = val[0];
    //  var val2 = val[1];
    //  console.log("====>>",val1,val2);
    var str = "Apples are round, and apples are juicy.";
    var splitted = str.split(" ", 3);
    console.log(val)
  }
  add_filter() {
    /*
        var arr: any[]=[];
        this.http.get('http://localhost:8000/schemeMasterRoutes/scheme-master/').subscribe((data: any) => {
    
        for(let i=0;i<data.length;i++){
          if(data[i].ADVANCE_EMI== this. btnvalue){
            arr.push(data[i]);
            this.data = arr;
            console.log('arr: ', arr);
          }
         
        }
        if(arr.length<=0)
        {
          this.data =undefined;
        }
  
  
          //console.log('data: ', data);
          // console.log(this.data);
          // console.log('data: ', data);
        }, (error: any) => console.error(error));
        */
    //new code
    var sel_val = document.getElementById("dog-names");
    var value = this.selval;
    console.log("the selected value is " + value);
    var newarr: any[] = [];
    if (value == "0" || value == "12") {
      newarr.push(value);
    }
    else {
      newarr = value.split("-");
    }
    //var tenure= (this.data.TENURE - this.data.ADVANCE_EMI)

    console.log('newarr: ', newarr);
    var arr: any[] = [];
    const loaderRef = this.modalService.open(LoaderComponent,{
      centered: true,
      animation:true,
      backdrop:'static',
      keyboard: false,
      windowClass:"remove-bg-modal",
     size:"sm",
    // modalDialogClass: " modal-dialog-centered d-flex justify-content-center"
    });
    this.apiService.dcg().subscribe((data: any) => {
      loaderRef.close();
      //this.schemeData = data;
      for (let i = 0; i < data.length; i++) {
        var ADVANCE_EMI = Number(data[i].advance_emi);
        var Tenure = Number(data[i].tenure);
        var grossTenure = Number(Tenure - ADVANCE_EMI);

        if (newarr[0] == "0" && newarr.length == 1 && data[i].advance_emi == this.btnvalue) {
          arr.push(data[i]);
          this.data = arr;
          //var ten = data[i].TENURE - data[i].ADVANCE_EMI

          console.log('arr: ', arr);
        }
        else if (grossTenure > Number(newarr[0]) && grossTenure <= Number(newarr[1]) && data[i].advance_emi == this.btnvalue) {
          arr.push(data[i]);
          this.data = arr;
          console.log('arr: ', arr);
        }
        else if (newarr[0] == "12" && newarr.length == 1) {
          if (grossTenure > 12 && data[i].advance_emi == this.btnvalue) {
            arr.push(data[i]);
            this.data = arr;
            console.log('arr: ', arr);
          }
        }
      }

      this.data = arr;


      if (arr.length <= 0) {
        this.data = undefined;
      }
      console.log('data: ', data);
      // console.log(this.data);
      // console.log('data: ', data);
    }, (error: any) => console.error(error));

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
    this.apiService.dcg().subscribe((data: any) => {
      loaderRef.close();
      this.data = data;
      this.cashback()
      // this.pcgMaster()
      console.log('dcgdata: ', data);
      // console.log(this.data);
      // console.log('data: ', data);
    }, (error: any) => console.error(error));
  }
  // pcgMaster() {
  //   const productCode = ["1512"]
  //   this.apiService.pcg(productCode).subscribe((data: any) => {
  //     this.pcgdata = data;
  //     this.getSchemeData()
  //     console.log('pcgdata: ', data);
  //     // console.log(this.data);
  //     // console.log('data: ', data);
  //   }, (error: any) => console.error(error));
  // }
  // getSchemeData() {
  //   const dealerCode = ["686"]
  //   this.apiService.master(dealerCode).subscribe((data: any) => {   
  //     this.schemeData = data;   
  //     console.log('master: ', data);
  //     // console.log(this.data);
  //     // console.log('data: ', data);
  //   }, (error: any) => console.error(error));
  // }


  onOptionsSelected(value: string) {
    console.log("the selected value is " + value);
    this.selval = value;
    var newarr = value.split("-");
    //var tenure= (this.data.TENURE - this.data.ADVANCE_EMI)

    console.log('newarr: ', newarr);
    var arr: any[] = [];
    const loaderRef = this.modalService.open(LoaderComponent,{
      centered: true,
      animation:true,
      backdrop:'static',
      keyboard: false,
      windowClass:"remove-bg-modal",
     size:"sm",
    // modalDialogClass: " modal-dialog-centered d-flex justify-content-center"
    });
    this.apiService.dcg().subscribe((data: any) => {
      loaderRef.close();
      this.data = data;
      for (let i = 0; i < data.length; i++) {
        var ADVANCE_EMI = Number(data[i].advance_emi);
        console.log('ADVANCE_EMI: ', ADVANCE_EMI);
        var Tenure = Number(data[i].tenure);
        console.log('Tenure: ', Tenure);
        var grossTenure = Number(Tenure - ADVANCE_EMI);
        if (newarr[0] == "0" && newarr.length == 1) {
          arr.push(data[i]);
          this.data = arr;
          //var ten = data[i].TENURE - data[i].ADVANCE_EMI

          console.log('arr: ', arr);
        }
        else if (grossTenure > Number(newarr[0]) && grossTenure <= Number(newarr[1])) {
          arr.push(data[i]);
          this.data = arr;
          console.log('arr: ', arr);
        }
        else if (newarr[0] == "12" && newarr.length == 1) {
          if (grossTenure > 12) {
            arr.push(data[i]);
            this.data = arr;
            console.log('arr: ', arr);
          }
        }

      }
      if (arr.length > 0) {
        this.data = arr;
      }
      if (arr.length <= 0) {
        this.data = undefined;
      }
      console.log('data: ', data);

    }, (error: any) => console.error(error));

  }


  cashback(){
  var data=  this.data
    for (let i = 0; i < data.length; i++) {
      var cashback = (data[i].oem);
      console.log('cashback: ', cashback);
    }
    
    }
  refresh() {
    var sel_val = document.getElementById("dog-names");
    var value = this.selval;
    console.log("the selected value is " + value);
    var newarr: any[] = [];
    if (value == "0" || value == "12") {
      newarr.push(value);
    }
    else {
      newarr = value.split("-");
    }
    console.log('newarr: ', newarr);
    var arr: any[] = [];
    // const dealerCode = ["686"]
    this.apiService.dcg().subscribe((data: any) => {
      this.data = data;
      for (let i = 0; i < data.length; i++) {
        var ADVANCE_EMI = Number(data[i].advance_emi);
        var Tenure = Number(data[i].tenure);
        var grossTenure = Number(Tenure - ADVANCE_EMI);
        if (newarr[0] == "0" && newarr.length == 1) {
          arr.push(data[i]);
          this.data = arr;
          //var ten = data[i].TENURE - data[i].ADVANCE_EMI

          console.log('arr: ', arr);
        }
        else if (grossTenure > Number(newarr[0]) && grossTenure <= Number(newarr[1])) {
          arr.push(data[i]);
          this.data = arr;
          console.log('arr: ', arr);
        }
        else if (newarr[0] == "12" && newarr.length == 1) {
          if (grossTenure > 12) {
            arr.push(data[i]);
            this.data = arr;
            console.log('arr: ', arr);
          }
        }
      }
      if (arr.length <= 0) {
        this.data = undefined;
      }
      console.log('data: ', data);
      // console.log(this.data);
      // console.log('data: ', data);
    }, (error: any) => console.error(error));

  }

}
