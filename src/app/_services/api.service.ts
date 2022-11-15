import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { CustomerSearch, ErrorResponse, Login, MerchantValidateResponse, ReportSearchData, SmRsmLogin, VerifyOTP } from "../_models/app";

@Injectable({
    providedIn: 'root'
})
export class ApiService{

    headers:any= {"Content-Type":"application/json"};
    constructor(private http:HttpClient){
        
    }

    merchantValidate(login: Login) {
        const url = environment.apiHostName+"merchant/validate";
        let executive: any = login.salesExecutive;
        executive.fromPage = login.fromPage;
        //console.log(executive);
        return this.http.post(url,executive,this.headers)
    }

    otpValidate(data:VerifyOTP){
        const url = environment.apiHostName+"merchant/verifyOTP";
        return this.http.post(url,data,this.headers);
    }

    otpResend(data:VerifyOTP){
        const url = environment.apiHostName+"merchant/resendOTP";
        return this.http.post(url,data,this.headers);
    }

    encryptPassword(data:SmRsmLogin){
        const url = environment.apiHostName+"ldap/encrypt";
        return this.http.post(url,data,this.headers); 
    }

    ldapAuthenticate(data:SmRsmLogin){
        const url = environment.apiHostName+"admin/login";
        return this.http.post(url,data,this.headers);
    }

    validateToken(token:String){
        const url = environment.apiHostName+"token/validate";
        let newHeaders = {...this.headers,"Authorization":"Bearer "+token} 
        return this.http.post(url,null,{headers:newHeaders})
    }

    getCustomerDetails(data:CustomerSearch,token:String){
        const url = environment.apiHostName+"customer_details/get";
        let newHeaders = {...this.headers,"Authorization":"Bearer "+token} 
        return this.http.post(url,data,{headers:newHeaders})
    }

    fetchSmRsmMobile(data:CustomerSearch,token:String){
        const url = environment.apiHostName+"customer_details/fetchSmRsmMobile";
        let newHeaders = {...this.headers,"Authorization":"Bearer "+token} 
        return this.http.post(url,data,{headers:newHeaders})
    }

    getReportData(searchData:ReportSearchData,token: String){
        const url = environment.apiHostName+"report/get";
        let newHeaders = {...this.headers,"Authorization":"Bearer "+token} 
        return this.http.post(url,searchData,{headers:newHeaders});
    }

    resendOtpSmRsmMobile(data:CustomerSearch,token:String){
        const url = environment.apiHostName+"customer_details/resendOtpSmRsmMobile";
        let newHeaders = {...this.headers,"Authorization":"Bearer "+token} 
        return this.http.post(url,data,{headers:newHeaders})
    }

    verifyOtpSmRsmMobile(data:VerifyOTP,token:String){
        const url = environment.apiHostName+"customer_details/verifyOtpSmRsmMobile";
        let newHeaders = {...this.headers,"Authorization":"Bearer "+token} 
        return this.http.post(url,data,{headers:newHeaders})
    }
    
    getScheduleData(token:String){
        const url = environment.apiHostName+"customer_details/scheduleData";
        let newHeaders = {...this.headers,"Authorization":"Bearer "+token} 
        return this.http.get(url,{headers:newHeaders})
    }
    getSchemeData(token:String){
        const url = environment.apiHostName+"api/excel/tutorials";
        let newHeaders = {...this.headers,"Authorization":"Bearer "+token} 
        return this.http.get(url,{headers:newHeaders})
    }
 
    add(login: Login) {
        const url = environment.apiHostName+"schemeMasterRoutes/scheme-master";
        let executive: any = login.salesExecutive;
        executive.fromPage = login.fromPage;
        //console.log(executive);
        return this.http.post(url,executive,this.headers)
    }
}