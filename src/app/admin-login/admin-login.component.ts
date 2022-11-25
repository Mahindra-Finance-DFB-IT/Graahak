import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbAlert, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, first, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import * as Forge from 'node-forge';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { AppData, Login,LoginType, PageName, SmRsmLogin } from '../models/app';
import { updateAppData } from '../models/app.action';
import { ApiService } from '../service/api.service';
import { LoaderComponent } from '../loader/loader.component';
import { AlertService, AuthenticationService } from '../_services';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {
 	loginForm: FormGroup;
	loading = false;
	submitted = false;
	showPassword = false;
	disabled:Boolean=true;
    error:boolean = false;
    errorObj:any=null;
	returnUrl: string;
	login: Login  = {
		loginType : LoginType.SALESEXECUTIVE.toString(),
		displayOverlay: false,
		fromPage: PageName.LoginPage,
		appData:{
		  isAuth: false,
		}
	};
	@ViewChild('selfClosingErrorAlert', {static: false}) 
    selfClosingErrorAlert: NgbAlert;
    invalidMessage = "";
	RSA_PUBLIC_KEY = `LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlHZk1BMEdDU3FHU0liM0RRRUJBUVVBQTRHTkFE
    Q0JpUUtCZ1FDcHZmVy9HK1J4ZUlKaHhZS0pFaEZhbkFlbwoydnhEWjFLY3VNa1cyc29Ya1VBWHk0
    Nm40cThlWko2VEF3VDFyR04zSEphVEMzUG5hLzU1eHNDL1ovWmVTN21UCjZzY0VIL2tBdyt2aWhB
    bjNnUW5hRUZMZkpYcU9ObGRqV2lwdVUvWEphbkdCVzlybkFiMDIxVnhQbDJoR1oyeC8KbU5tQW1j
    eWZqZlhzYWZ4MmR3SURBUUFCCi0tLS0tRU5EIFBVQkxJQyBLRVktLS0tLQo=`;
	private _error = new Subject<string>();
    messageTimeOutInSeconds = 10000;
	constructor(
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private authenticationService: ApiService,
		private alertService: AlertService,
		private modalService: NgbModal,
		private appComponent:AppComponent,
                private authService: AuthService,
                private store: Store<{ appItem: AppData }>
	) {
		// redirect to home if already logged in
		// if (this.authenticationService.currentUserValue) {
		// 	this.router.navigate(['/home']);
		// }
	}

	toggleShowPassword(){
        this.showPassword = !this.showPassword;
        //this.loginForm.controls.smRsm.controls.password.= (this.showPassword)?'text':'password';
    }
	
	ngOnInit() {
		this._error.subscribe(message => this.invalidMessage = message);
		this.loginForm = this.formBuilder.group({
			sapId: ['', Validators.required],
			password: ['', Validators.required]
		});
		// get return url from route parameters or default to '/'
		this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/file-upload';
	}

	// convenience getter for easy access to form fields
	// get f() { return this.loginForm.controls; }
	get loginFormControl() {
		return this.loginForm.controls;
	}
    
	public changeErrorMessage(msg:String) { this._error.next(msg.toString()); }
	
	onSubmit() {
		this.submitted = true;
		if (this.loginForm.invalid) {
			return;
		}
		const loaderRef = this.modalService.open(LoaderComponent,{
			centered: true,
			animation:true,
			backdrop:'static',
			keyboard: false,
			windowClass:"remove-bg-modal",
		   	size:"sm",
		});
		let password = this.loginForm.value.password || "";
		const publicKey = Forge.pki.publicKeyFromPem(Forge.util.decode64(this.RSA_PUBLIC_KEY));
		const encryptedPassword = publicKey.encrypt(password.toString(),'RSAES-PKCS1-V1_5');
		
		let entityUserPassword = Forge.util.encode64(encryptedPassword);
		this.loading = true;
		this.authenticationService.login(this.loginForm.value.sapId, entityUserPassword.toString()).subscribe((data: any)=>{
			let appData:AppData = {};
            appData.transactionID ="";
            appData.isAuth= true;
            appData.token = data.token;
            appData.loginType= this.login.loginType;
            appData.userId= this.loginForm.value.sapId;
			loaderRef.close();
			this.appComponent.isAdmin = true;
			this.store.dispatch(updateAppData(appData));
			this.router.navigateByUrl("/file-upload");
		}, (err)=>{
			loaderRef.close();
			this.disabled = true;
			this.error = true;
			if(err.error.error || err.error.errors){
			  if(err.error?.error){
				this.changeErrorMessage(err.error.error);
			  }
			  if(err.error?.errors){
				err.error?.errors.forEach((_m: String) => {
				  this.changeErrorMessage(_m);
				});
			  }
			} else {
			  this.changeErrorMessage(err.message);
			}
		})
	}
	
    encryptPassword(event:any){
		if(event.target.value.length > 0){
		  let sm: SmRsmLogin = {};
		  sm.EntityUserPassword = event.target.value;
		  this.authenticationService.encryptPassword(sm).subscribe((data:any)=>{
			let value = (data.HashValue)?data.HashValue:'';
			},(err:any)=>{
		  })
		}
	}
}