import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from '../service/api.service';
// import { DetailsComponent } from '../details/details.component';
@Component({
  selector: 'app-cal-master',
  templateUrl: './cal-master.component.html',
  styleUrls: ['./cal-master.component.css']
})
export class CalMasterComponent implements OnInit {
  data: any;
  constructor(   public http: HttpClient,
    public apiService: ApiService,
    public router: ActivatedRoute,) { }

  ngOnInit(): void {
    this.add();
    
  }
  formula(amtamount:any){
    var loan_amount=amtamount;
    console.log('loan_amount: ', loan_amount);
    var id= this.router.snapshot.params['id'];
    var url = environment.apiHostName +"api/excel/scheme-master/"
    this.http.get(url+id).subscribe((data: any) => {
      var tenure=data.TENURE
    var rate=data.ROI
    let result = rate.substring(0, 5);
    var newrate=result/100;
    var EMIAmount= Number(loan_amount*newrate/12)/(1-Math.pow((1+newrate/12),(-tenure)))
    console.log('EMIAmount: ', EMIAmount);
    var ADVANCE_EMI=  Number (EMIAmount * data.ADVANCE_EMI)
    console.log('ADVANCE_EMI: ', ADVANCE_EMI);
    var PROCESSING_FEE = Number (data.PROCESSING_FEE)
    var  TotalPaymenttransaction =Number ( ADVANCE_EMI +PROCESSING_FEE)
    console.log('data.PROCESSING_FEE: ', PROCESSING_FEE);
    console.log('TotalPaymenttransaction: ', TotalPaymenttransaction);
   var TotalIntrestduringloantenure =Number((EMIAmount * data.TENURE) - loan_amount)
   console.log('TotalIntrestduringloantenure: ', TotalIntrestduringloantenure);
   var Totalofintrest = Number (TotalIntrestduringloantenure +  PROCESSING_FEE)
   console.log('Totalofintrest: ', Totalofintrest);
   var Advance_EMI = ADVANCE_EMI
   console.log('Advance_EMI: ', Advance_EMI);
  var Amounttobepaidby =TotalPaymenttransaction
  console.log('Amounttobepaidby: ', Amounttobepaidby);
    }, (error: any) => console.error(error));
    
    
  
  }
  add() {
    // var loan_amount=50000;
    // var tenure=15;
    // var rate=20.71/100;
    // var emi= (loan_amount*rate/12)/(1-Math.pow((1+rate/12),(-tenure)))
    // // loan_amount * (rate / 12)/1-((1+(rate/12))^(-tenure)) 
    // console.log('emi: ', emi);
    var id= this.router.snapshot.params['id'];
    this.http.get('http://localhost:8000/api/excel/scheme-master/'+id).subscribe((data: any) => {
      var datan=[{data}]
      console.log('datan: ', datan);
      var result = Object.keys(data).map((key) => [String(key), data[key]]);
      this.data = datan;
    }, (error: any) => console.error(error));
  }
}
