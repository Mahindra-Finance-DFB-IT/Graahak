import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { SchemeListComponent } from './scheme-list/scheme-list.component';
import { SchemeDetailComponent } from './scheme-detail/scheme-detail.component';
import { FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { UploadDataComponent } from './upload-data/upload-data.component';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { ViewRecordComponent } from './view-record/view-record.component';
const materialModules = [
  MatTableModule,
  MatPaginatorModule,
  MatSortModule
];
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
    SchemeListComponent,
    SchemeDetailComponent,
    UploadDataComponent,
    ViewRecordComponent
  ],
  exports: [
    ...materialModules
  ],
  imports: [ 
    CommonModule,
    ...materialModules, 
    MatButtonModule,
    BrowserAnimationsModule,
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
    MatSnackBarModule,
    StoreModule.forRoot({
      appItem: AppReducer
    })
  ],

  providers: [
    AuthService,
    AuthGuard
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
