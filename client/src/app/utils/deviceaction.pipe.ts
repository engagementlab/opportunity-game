import { Pipe, PipeTransform } from '@angular/core';
import * as ismobile from 'ismobilejs';

@Pipe({
  name: 'deviceAction'
})
export class DeviceactionPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return (ismobile.tablet || ismobile.phone) ? value.mobile : value.desktop;
  }

}
