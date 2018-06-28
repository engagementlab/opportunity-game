import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

export interface DeactivateGuard {
  canDeactivate: () => boolean | Observable<boolean>;
}

@Injectable()
export class PendingChangesGuard implements CanDeactivate<DeactivateGuard> {
  canDeactivate(component: DeactivateGuard,
  	currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot): boolean | Observable<boolean> {

  	let allow: boolean;

  	if(nextState.url.indexOf('/game/start') > -1)
  		allow = false;
  	else if(nextState.url.indexOf('/game') > -1)
  		allow = true;

    // if there are no pending changes, just allow deactivation; else confirm first
    return !allow ? confirm('WARNING: Your game will end if you leave!') : true; 
  }
}