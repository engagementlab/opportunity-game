import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeTags'
})
export class RemoveTagsPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    var re = new RegExp("<\s*p[^>]*>(.*?)<\s*/\s*p>");
    var arr = re.exec(value);

    if(arr)
        return arr[1];
  }

}
