import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../Services/authentication.service';


@Injectable()
export class AuthGuard {

  constructor(private authservice : AuthenticationService , private router : Router) { }


  canActivate(route : ActivatedRouteSnapshot, state : RouterStateSnapshot):MaybeAsync<GuardResult> {

    if(this.authservice.authenticated==true){
      return true;
    }else{

      this.router.navigateByUrl('/login')
    return false;
    }
  }
}

