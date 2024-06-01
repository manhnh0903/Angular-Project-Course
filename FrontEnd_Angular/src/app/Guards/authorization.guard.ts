import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../Services/authentication.service';


@Injectable()
export class AuthorizationGuard {

  constructor(private authservice : AuthenticationService , private router : Router) { }


  canActivate(route : ActivatedRouteSnapshot, state : RouterStateSnapshot):MaybeAsync<GuardResult> {

   let authorize = false;

   let authorizedRoles : String[] = route.data['roles'] as string[];

   let roles : string[] = this.authservice.roles as string[];

   for(let i = 0; i < roles.length; i++){
      if(authorizedRoles.includes(roles[i])){
        authorize = true;
        
      }
   }
   return authorize;
  }
}

