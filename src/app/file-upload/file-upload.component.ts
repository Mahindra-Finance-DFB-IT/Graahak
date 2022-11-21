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
  @ViewChild('selfClosingErrorAlert', {static: false})
  selfClosingErrorAlert: NgbAlert;
  invalidMessage: string = "";
  validMessage: string;
  private _error = new Subject<string>();
  messageTimeOutInSeconds = 10000;
  constructor(private uploadService: UploadFilesService,
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
    this._error.subscribe(message => this.invalidMessage = message);
    this.selectedFileType = 'master'; 
    this._error.pipe(debounceTime(this.messageTimeOutInSeconds)).subscribe(()=>{
      if(this.selfClosingErrorAlert){
        this.selfClosingErrorAlert.close();
      }
    })     
  }

  public changeErrorMessage(msg:String) { this._error.next(msg.toString()); }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
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
            this.validMessage='File uploaded successfully';
          }
        }, (err: any) => {
          loaderRef.close();
          if (err.error && err.error.message) {
            this.invalidMessage='Uploading failed! Please try again';
            // this.message = err.error.message;
          } else {
            this.invalidMessage='Uploading failed! Please try again';
            // this.message = 'Could not upload the file!';
          }
          this.currentFile = undefined;
        });
      }
      this.selectedFiles = undefined;
    } else {
      loaderRef.close();
    }
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
            this.validMessage ='File uploaded successfully';
          }
        }, (err: any) => {
          loaderRef.close();
          if (err.error && err.error.message) {
            this.invalidMessage='Uploading failed! Please try again';
          } else {
            this.invalidMessage='Uploading failed! Please try again';
          }
          this.currentFile = undefined;
        });
      }
      this.selectedFiles = undefined;
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
            this.validMessage = 'File uploaded successfully';
            // this.changeErrorMessage('File uploaded successfully');
          }
        }, (err: any) => {
          loaderRef.close();
          if (err.error && err.error.message) {
            this.invalidMessage='Uploading failed! Please try again';
          } else {
            this.invalidMessage='Uploading failed! Please try again';
          }
        });
        this.currentFile = undefined;
      }
      this.selectedFiles = undefined;
    } else {
      loaderRef.close();
    }
  }

  sumbitFile() {
    if (this.selectedFileType == "master") {
      this.uploadMaster()
    }
    else if (this.selectedFileType == "pcg") {
      this.uploadPcg()
    }
    else if (this.selectedFileType == "dcg") {
      this.uploadDcg()
    }
  }

}