import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { ApiService } from '../service/api.service';
import { AppData, LoginType } from '../models/app';
import { LoaderComponent } from '../loader/loader.component';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-scheme-detail',
  templateUrl: './scheme-detail.component.html',
  styleUrls: ['./scheme-detail.component.css']
})
export class SchemeDetailComponent implements OnInit {
  schemeAmount:any = "";
  data:any;
  isShowDivIf:boolean = false; 
  formula:any
  isrange:boolean = false;
  appData$: Observable<AppData>;
  appData: AppData = {}

  constructor(
    public http: HttpClient,
    public apiService: ApiService,
    public router: ActivatedRoute,
    private modalService: NgbModal,
    public route: Router,
    public authService: AuthService,
    private store:Store<{appItem: AppData }>
  ) {
    this.appData$ = store.select('appItem');
    this.appData$.subscribe((obj:AppData)=>{
      this.appData = obj;
    })
  }
  ngOnInit(): void {
    this.getSchemeDetails();
  }

  getSchemeDetails() {
    const loaderRef = this.modalService.open(LoaderComponent,{
      centered: true,
      animation:true,
      backdrop:'static',
      keyboard: false,
      windowClass:"remove-bg-modal",
      size:"sm"
    });
    var id = this.router.snapshot.params['schemeId'];
    let token: String = ''; 
    if(this.appData.token){
      token = this.appData.token;
    }
    var sessionData = this.authService.getData();
    var obj = {
      'posid': (sessionData?.loginType == LoginType.SALESEXECUTIVE) ? sessionData?.salesExecutive?.posId : '',
      'id': id
    };
    this.apiService.getSchemeDetail(obj, token).subscribe((data: any) => {
      loaderRef.close();
      this.data = data;
    }, (error: any) => console.error(error));
  }

  validateDetails (amtamount: any) {
    this.isrange = false;
    if (Number(amtamount) < Number(this.data[0].min_amount)) {
      this.isrange = true;
    } else if (Number(amtamount) > Number (this.data[0].max_amount)) {
      this.isrange = true;
    } else {
      this.isrange = false;
      const loaderRef = this.modalService.open(LoaderComponent,{
        centered: true,
        animation:true,
        backdrop:'static',
        keyboard: false,
        windowClass:"remove-bg-modal",
        size:"sm"
      });
      this.isShowDivIf = true;
      var loan_amount=Number(amtamount);
      var id= this.router.snapshot.params['id'];
      let token:String = ''; 
      if(this.appData.token){
        token = this.appData.token;
      }
      var obj = {
        'posid':  this.authService.userPosId,
        'id': id
      };
      var data = this.data;
      loaderRef.close();
      var tenure = Number(data[0].tenure);
      var rate = data[0].roi 
      let result = rate.split('%')[0];
      var newrate = result/100;
      var emiAmount = Number((loan_amount*newrate/12)/(1-Math.pow((1+newrate/12),(-tenure))));
      emiAmount = Math.round(emiAmount*100)/100;
      var advanceEmi=  Number(emiAmount * data[0].advance_emi);
      advanceEmi = Math.round(advanceEmi*100)/100;
      var processing_fee = 0;
      if (isNaN(data[0].processing_fee)) {
        var fees = data[0].processing_fee.replace(/\s/g, "");
        processing_fee = Number(loan_amount/100) * Number(fees.split('%')[0]);
      } else {
        processing_fee = Number(data[0].processing_fee);
      }
      var transactionPayment = Number (advanceEmi + processing_fee);
      transactionPayment = Math.round(transactionPayment*100)/100;
      var remaningemi = data[0].tenure - data[0].advance_emi;
      var totalInterest = Number((emiAmount * data[0].tenure) - loan_amount);
      totalInterest = Math.round(totalInterest*100)/100;
      var totalOfInterest = Number(totalInterest + processing_fee);
      totalOfInterest = Math.round(totalOfInterest*100)/100;
      var additional_Cashback = 0;
      var net_Cost_Custmerr= totalOfInterest - totalInterest - additional_Cashback;
      var net_Cost_Custmer = net_Cost_Custmerr.toFixed(2);
      var dbd_result = data[0].dbd;
      let dbdresult = dbd_result.split('%')[0];
      var dbdrate = Number(dbdresult/100);
      var dbd = dbdrate * amtamount;
      var distributed_delerto_mmfsl = amtamount-(dbd + processing_fee + advanceEmi);
      this.formula = {
        emiAmount: emiAmount.toFixed(2),
        remaningemi: remaningemi,
        advance_emi: advanceEmi,
        totalOfInterest: totalOfInterest.toFixed(2),
        amountPaidBy: transactionPayment.toFixed(2),
        totalInterest: totalInterest.toFixed(2),
        net_Cost_Custmer: net_Cost_Custmer,
        dbd: dbd.toFixed(2),
        distributed_delerto_mmfsl: distributed_delerto_mmfsl.toFixed(2),
        processing_fees:processing_fee.toFixed(2),
        schemeAmountuser:this.schemeAmount.toFixed(2),
        additional_Cashback: additional_Cashback.toFixed(2),
        total_Cashback: (additional_Cashback + totalInterest).toFixed(2)
      };
    }
  }
}
