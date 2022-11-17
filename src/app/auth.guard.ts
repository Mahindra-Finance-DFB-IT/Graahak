import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate,  Router, RouterStateSnapshot } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/internal/Observable';
import { LogoutComponent } from './logout.component';
import { ApiService } from './service/api.service';
import { AuthService } from './service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService,
    private router:Router,
    private apiService: ApiService,
    private modalService: NgbModal)
  {};
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise(res =>{
      const authData = this.authService.getData();
      if (authData?.token) {
          this.apiService.validateToken(authData.token.toString()).subscribe((data)=>{
            return res(true);
          },async (err)=>{
            const modalRef =  await this.modalService.open(LogoutComponent,{
              centered: true,
              animation:true,
              backdrop:'static',
              keyboard: false,
              size:"sm",
            })
            modalRef.closed.subscribe(_d=>{
              console.log(err);
              this.authService.logout();
              this.router.navigate(['/login']);
              return res(false);
            })
          });
      } else {
        this.authService.logout();
        this.router.navigate(['/login']);
        return res(false);
      }
    });
  }
}
