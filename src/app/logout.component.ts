import { ChangeDetectorRef, Component, Injectable, Input } from "@angular/core";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector:"app-logout-confirm",
    template: `<div class="modal-body verify-otp text-center">
                    <div class="row">
                        <div class="col">
                            <div class="logout-popup">
                                Your session has expired<br/> please login again <br/>
                                <div class="d-grid gap-2">
                                    <button type="button" class="btn btn-primary mt-4 logout-btn" (click)="activeModal.close(true)">Login</button>
                                </div>
                            </div>
                        </div>
                    </div>
               </div>`
})
export class LogoutComponent{
    constructor(public activeModal:NgbActiveModal,public changeRef:ChangeDetectorRef){
   }
}