import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { CustomerSearch, ErrorResponse, Login, MerchantValidateResponse, ReportSearchData, SmRsmLogin, VerifyOTP } from "../models/app";
import { AuthService } from "./auth.service";
import { ActivatedRoute } from '@angular/router';
@Injectable({
    providedIn: 'root'
})
export class ApiService{
    [x: string]: any;
    private currentUserSubject: BehaviorSubject<any>;
    headers:any= {"Content-Type":"application/json"};
    constructor(private http:HttpClient,
       private authservice:AuthService,
       public router: ActivatedRoute,){
        
    }

    merchantValidate(login: Login) {
        const url = environment.apiHostName+"merchant/validate";
        let executive: any = login.salesExecutive;
        executive.fromPage = login.fromPage;
        //console.log(executive);
        return this.http.post(url,executive,this.headers)
    }
    login(sapId: string, password: string) {
		return this.http.post<any>(`http://localhost:8000/admin/login`, { sapId, password })

// 			.pipe(map((user: { token: any; }) => {
// console.log("========",user,);
// 				// login successful if there's a jwt token in the response
// 				if (user && user.token) {
// 					// store user details and jwt token in local storage to keep user logged in between page refreshes
// 					localStorage.setItem('currentUser', JSON.stringify(user));
// 					this.currentUserSubject.next(user);
// 				}

			// return user;
			// }));
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
        const url = environment.apiHostName+"ldap/authenticate";
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
    dcg() {
        const url = environment.apiHostName+"dcg/query";
    //    const posid=this.authservice.userPosId
    const posid="1015523    "
    return this.http.post(url,{posid:posid});

	
}
dcgById(id:any) {

    const url = environment.apiHostName+"dcg/"+id;
//    const posid=this.authservice.userPosId
const posid="1005925"
return this.http.post(url,{posid:posid});


}
pcg(productCode:any) {
    const url = environment.apiHostName+"pcg/query";
//    const posid=this.authservice.userPosId

    return this.http.post(url,{productCode});


}
master(dealerCode:any) {
    const url = environment.apiHostName+"schemeMasterRoutes/scheme-master";
//    const posid=this.authservice.userPosId
    return this.http.post(url,{dealerCode});


}
}