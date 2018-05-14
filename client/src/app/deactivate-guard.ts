import { CanDeactivate } from '@angular/router';
import { GameHomeComponent } from './game/home/home.component';

export default class DeactivateGuard implements CanDeactivate<GameHomeComponent> {

  canDeactivate(component: GameHomeComponent) {
    let can = component.canDeactivate();
    console.log('DeactivateGuard#canDeactivate called, can: ', can);
    if (!can) {
      alert('Deactivation blocked');
      return false;
    }

    return true;
  }

}