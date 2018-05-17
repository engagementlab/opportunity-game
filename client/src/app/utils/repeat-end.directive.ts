import { Directive } from '@angular/core';

@Directive({
  selector: '[repeatEnd]'
})
export class RepeatEndDirective {

  constructor() {
  	return {
          restrict: "A",
          link: function (scope, element, attrs) {
              if (scope.$last) {
                  scope.$eval(attrs.repeatEnd);
              }
          }
      };
  }

}
