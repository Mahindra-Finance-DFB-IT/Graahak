import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ReportComponent } from './report/report.component';
import { AuthService } from './service/auth.service';
import { AuthGuard } from './auth.guard';
import { ReactiveFormsModule } from '@angular/forms';
import { OtpComponent } from './otp/otp.component';
import { NgOtpInputModule } from  'ng-otp-input';
import { MaskPipe } from './otp/mask.pipe';
import { FormatTimePipe } from './otp/formatTime.pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { CustomerdetailsComponent } from './customer/customerdetails/customerdetails.component';
import { CustomersearchComponent } from './customer/customersearch/customersearch.component';
import { StoreModule } from '@ngrx/store';
import { AppReducer } from './models/app.reducer';
import { LoaderComponent } from './loader/loader.component';
import { LogoutComponent } from './logout.component';
import { DataTablesModule } from 'angular-datatables';
import { MandateStatusPipe } from './customer/customerdetails/mandata_status.pipe';
import { RupeeSignPipe } from './customer/customerdetails/rupee_sign.pipe';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
// import {MatNativeDateModule} from '@angular/material/core';

import { EmiHomeComponent } from './emi-home/emi-home.component';
import { DetailsComponent } from './details/details.component';
import { CalMasterComponent } from './cal-master/cal-master.component'
import { FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MatButtonModule } from 
    '@angular/material/button';
import { MatButtonToggleModule } from 
    '@angular/material/button-toggle';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    ReportComponent,
    OtpComponent,
    MaskPipe,
    FormatTimePipe,
    MandateStatusPipe,
    RupeeSignPipe,
    CustomerdetailsComponent,
    CustomersearchComponent,
    LoaderComponent,
    LogoutComponent,
    AdminLoginComponent,
    FileUploadComponent,
    EmiHomeComponent,
    DetailsComponent,
    CalMasterComponent
  ],
  imports: [  
    MatButtonModule,
     MatButtonToggleModule,
    Ng2SearchPipeModule,
    BrowserModule,
    DataTablesModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgOtpInputModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    StoreModule.forRoot({
      appItem: AppReducer
    })
  ],

  providers: [
    AuthService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
