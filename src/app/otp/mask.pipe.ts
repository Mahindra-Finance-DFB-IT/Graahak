import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mask'
})
export class MaskPipe implements PipeTransform {

  transform(value: string | undefined, showMask :boolean): string | undefined {
    if (!showMask  || value == undefined) {
      return value;
    }

    if( value?.length < 10){
      return value;
    }
    return 'XXXXX' + value.substring(value.length - 4);
  }

}