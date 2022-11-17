import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AuthGuard } from './auth.guard';
import { CalMasterComponent } from './cal-master/cal-master.component';
import { CustomerdetailsComponent } from './customer/customerdetails/customerdetails.component';
import { CustomersearchComponent } from './customer/customersearch/customersearch.component';
import { DetailsComponent } from './details/details.component';
import { EmiHomeComponent } from './emi-home/emi-home.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ReportComponent } from './report/report.component';
import { UploadFilesService } from './_services/upload-files.service';

const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'admin-login', component: AdminLoginComponent},
  { path: 'home', component: HomeComponent, canActivate:[AuthGuard]},
  { path: 'report', component: ReportComponent, canActivate:[AuthGuard]},
  { path: 'customer_search', component: CustomersearchComponent, canActivate:[AuthGuard]},
  { path: 'customer_details', component: CustomerdetailsComponent, canActivate:[AuthGuard]},
  { path: 'file-upload', component: FileUploadComponent, canActivate:[AuthGuard]},
  { path: 'scheme-cal', component: EmiHomeComponent, canActivate:[AuthGuard]},
  { path: 'detail/:OEM/:id', component: DetailsComponent, canActivate:[AuthGuard]},
  { path: 'master/:OEM/:id', component: CalMasterComponent, canActivate:[AuthGuard]},
  { path:'', redirectTo: '/home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{enableTracing: false,useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }