import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl } from "@angular/forms";
// import { FileValidators } from "ngx-file-drag-drop";
import { Router } from '@angular/router';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable, Subject, debounceTime } from 'rxjs';
import { UploadFilesService } from './../_services/upload-files.service';
import {MDCRipple} from '@material/ripple';
import { NgbAlert, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoaderComponent } from '../loader/loader.component';
import { ApiService } from '../service/api.service';
import { Store } from '@ngrx/store';
import { AppData } from 'src/app/models/app';
import { AuthService } from '../service/auth.service';
import { LogoutComponent } from '../logout.component';
@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {
  [x: string]: any;
  selectedFiles?: FileList;
  currentFile?: File;
  appData$: Observable<AppData>;
  appData: AppData = {}
  message = '';
  selectedFileType: string;
  fileInfos?: Observable<any>;
  data:any;
  invalidMessage: string = "";
  validMessage: string;
  fileName: string;
  fileSize: string;
  private _error = new Subject<string>();
  messageTimeOutInSeconds = 10000;
  constructor(private uploadService: UploadFilesService,
  private authService: AuthService,
  public router: Router,
  public apiService: ApiService,
  private modalService: NgbModal,
  public route:Router,
  private store:Store<{appItem: AppData }>) {
    this.appData$ = store.select('appItem');
    this.appData$.subscribe((obj:AppData)=>{
    this.appData = obj;
    })
   }

  ngOnInit(): void {
    this.selectedFileType = 'master';
  }

  selectTab(tabName: string) {
    this.selectedFileType = tabName;
    this.resetFile();
  }

  openSection() {
    this.router.navigateByUrl("/view-record");
  }

  setMessage(msg: string, type: string) {
    type == 'success' ? this.validMessage = msg : this.invalidMessage = msg;
    // setTimeout(()=>{                  
      // this.invalidMessage = '';
      // this.validMessage = '';
    // }, 7000);
  }

  closeMsg() {
    this.invalidMessage = '';
    this.validMessage = '';
  }


  uploadMaster(): void {
    const loaderRef = this.modalService.open(LoaderComponent,{
      centered: true,
      animation:true,
      backdrop:'static',
      keyboard: false,
      windowClass:"remove-bg-modal",
      size:"sm",
    });
    let token:String = '';
    if (this.appData.token) {
      token = this.appData.token;
    }
    
    if (this.selectedFiles ) {
      const file: File | null = this.selectedFiles.item(0);
      if (file) {
        this.currentFile = file;
        this.uploadService.uploadMasterFile(this.currentFile,token).subscribe((data:any) => {
          if (data && data?.body && data?.body?.res == 'success') {
            loaderRef.close();
            this.resetFile();
            var successmMsg = "Master File uploaded successfully <br/> \
              Total Records: " + data.body.totalCount + " <br/>\
              Added Records: " + data.body.validRows + " <br/>\
              Invalid Records: " + data.body.invalidRows + " <br/>";
            this.setMessage(successmMsg, 'success');
          }
        }, (err: any) => {
          loaderRef.close();
          this.resetFile();
          this.currentFile = undefined;
          if (err.status == 401) {
            this.doLogOut();
          } else {
            var errMsg = '';
            if (err.status == 500 && err.error && err.error.message) {
              errMsg = "Uploading failed! <br/> \
                Total Records: " + err.error.totalCount + " <br/>\
                Added Records: " + err.error.validRows + " <br/>\
                Invalid Records: " + err.error.invalidRows + " <br/>";
            } else if (err.status == 501) {
              errMsg = err.error.message;
            } else {
              errMsg = 'Uploading failed! Please try again';
            }
            this.setMessage(errMsg, 'error');
          }
        });
      } else {
        loaderRef.close();
        this.resetFile()
      }
    } else {
      loaderRef.close();
    }
  }

  doLogOut() {
    const modalRef =  this.modalService.open(LogoutComponent,{
      centered: true,
      animation:true,
      backdrop:'static',
      keyboard: false,
      size:"sm",
    })
    modalRef.closed.subscribe(_d=>{
      // console.log(err);
      this.authService.logout();
      this.router.navigate(['/admin-login']);
      // return res(false);
    });
  }
  
  uploadDcg(): void {
    const loaderRef = this.modalService.open(LoaderComponent,{
      centered: true,
      animation:true,
      backdrop:'static',
      keyboard: false,
      windowClass:"remove-bg-modal",
      size:"sm",
    });
    let token:String = '';
    if(this.appData.token){
      token = this.appData.token;
    }
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      if (file) {
        this.currentFile = file;
        this.uploadService.uploadDcgFile(this.currentFile,token).subscribe((data:any)=> {
          if (data && data?.body && data?.body?.res == 'success') {
          loaderRef.close();
          this.resetFile();
          this.setMessage('File uploaded successfully', 'success');
          }
        }, (err: any) => {
          loaderRef.close();
          this.resetFile();
          this.currentFile = undefined;
          if (err.status == 401) {
            this.doLogOut();
          } else {
            if (err.error && err.error.message) {
              this.setMessage('Uploading failed! Please try again', 'error');
            } else {
              this.setMessage('Uploading failed! Please try again', 'error');
            }
          }
        });
      }
      else{
        loaderRef.close();
        this.resetFile()
      }
    } else {
      loaderRef.close();
    }
  }

  uploadPcg(): void {
    const loaderRef = this.modalService.open(LoaderComponent,{
      centered: true,
      animation:true,
      backdrop:'static',
      keyboard: false,
      windowClass:"remove-bg-modal",
      size:"sm",
    });
    let token:String = '';
    if(this.appData.token){
      token = this.appData.token;
    }
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      if (file) {
        this.currentFile = file;
        this.uploadService.uploadPcgFile(this.currentFile,token).subscribe((data:any) => {
          if (data && data?.body && data?.body?.res == 'success') {
          loaderRef.close();
          this.resetFile();
          var successmMsg = "File uploaded successfully <br/> \
                Total Records: " + data.body.totalCount + " <br/>\
                Records Added: " + data.body.activeCount + " <br/>\
                Records Failed: " + data.body.errorRecords + " <br/>\
                Inactive Records: " + data.body.inActiveCount + " <br/>\
                ";
          this.setMessage(successmMsg, 'success');
          }
        }, (err: any) => {
          loaderRef.close();
          this.resetFile();
          this.currentFile = undefined;
          if (err.status == 401) {
            this.doLogOut();
          } else {
            if (err.error && err.error.message) {
              var errMsg = "Uploading failed! <br/> \
                Total Records: " + err.error.totalCount + " <br/>\
                Records Added: " + err.error.activeCount + " <br/>\
                Records Failed: " + err.error.errorRecords + " <br/>\
                Inactive Records: " + err.error.inActiveCount + " <br/>\
                ";
              this.setMessage(errMsg, 'error');
            } else {
              this.setMessage('Uploading failed! Please try again', 'error');
            }
          }
        });
      }
      else{
        loaderRef.close();
        this.resetFile()
      }
    } else {
      loaderRef.close();
    }
  }

  sumbitFile() {
    if (this.selectedFileType == "master") {
      this.uploadMaster()
    } else if (this.selectedFileType == "pcg") {
      this.uploadPcg()
    } else if (this.selectedFileType == "dcg") {
      this.uploadDcg()
    }
  }

  onFileSelected(event: any) { 
    this.selectedFiles = event.target.files;
    const file: File = event.target.files[0];
    this.fileName = file.name;
    this.fileSize = (file.size/1024).toFixed(2) + ' KB';
    if (file && file.size > 2000000) {
      this.setMessage('File size too large', 'error');
      this.resetFile();
      return;
    }
    // event.target.value = '';
  }

  resetFile() {
    this.selectedFiles = undefined;
    this.fileName = '';
    this.fileSize = '';
  }

}