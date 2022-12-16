import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AuthGuard } from './auth.guard';
import { CustomerdetailsComponent } from './customer/customerdetails/customerdetails.component';
import { CustomersearchComponent } from './customer/customersearch/customersearch.component';
import { SchemeDetailComponent } from './scheme-detail/scheme-detail.component';
import { SchemeListComponent } from './scheme-list/scheme-list.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ReportComponent } from './report/report.component';
import { UploadFilesService } from './_services/upload-files.service';
import { ViewRecordComponent } from './view-record/view-record.component';
import { LogsDataComponent } from './logs-data/logs-data.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'admin-login', component: AdminLoginComponent},
  {path:'logs',component:LogsDataComponent},
  { path: 'view-record', component: ViewRecordComponent, canActivate:[AuthGuard]},
  { path: 'home', component: HomeComponent, canActivate:[AuthGuard]},
  { path: 'report', component: ReportComponent, canActivate:[AuthGuard]},
  { path: 'customer_search', component: CustomersearchComponent, canActivate:[AuthGuard]},
  { path: 'customer_details', component: CustomerdetailsComponent, canActivate:[AuthGuard]},
  { path: 'file-upload', component: FileUploadComponent, canActivate:[AuthGuard]},
  { path: 'scheme_list', component: SchemeListComponent, canActivate:[AuthGuard]},
  { path: 'scheme_detail/:schemeId', component: SchemeDetailComponent, canActivate:[AuthGuard]},
  { path:'', redirectTo: '/home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{enableTracing: false,useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }