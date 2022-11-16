import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl } from "@angular/forms";
// import { FileValidators } from "ngx-file-drag-drop";
import { Router } from '@angular/router';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
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
  data:any
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
    this.selectedFileType = 'master';      
  }

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
    if(this.appData.token){
      token = this.appData.token;
    }
   
    if (this.selectedFiles ) {
      const file: File | null = this.selectedFiles.item(0);
      if (file) {
        this.currentFile = file;
        console.log('currentFile:===== ', this.currentFile);
        this.uploadService.uploadMasterFile(this.currentFile,token).subscribe((data:any) => {
          if (data && data?.body && data?.body?.res == 'success') {
            loaderRef.close();
            alert('File uploaded successfully');
            console.log(data && data?.body && data?.body?.res); 
          }
        }, (err: any) => {
          console.log(err);
          if (err.error && err.error.message) {
            this.message = err.error.message;
          } else {
            this.message = 'Could not upload the file!';
          }
          this.currentFile = undefined;
        });
      }
      this.selectedFiles = undefined;
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
          console.log('data: ', data); 
          loaderRef.close();  
           
          },
          (err: any) => {
            console.log(err);
          

            if (err.error && err.error.message) {
              this.message = err.error.message;
            } else {
              this.message = 'Could not upload the file!';
            }

            this.currentFile = undefined;
          });

      }

      this.selectedFiles = undefined;
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
          console.log('data: ', data);
            loaderRef.close();  
          
          
          },
          (err: any) => {
            console.log(err);
           
            
            if (err.error && err.error.message) {
              this.message = err.error.message;
            } else {
              this.message = 'Could not upload the file!';
            }
          });

            this.currentFile = undefined;

      }

      this.selectedFiles = undefined;
    }
  }
  sumbitFile() {
    console.log(this.selectedFileType);
    if (this.selectedFileType == "master") {
      console.log("asdfgh");
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