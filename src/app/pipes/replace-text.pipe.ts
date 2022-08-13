import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceText'
})

export class ReplaceTextPipe implements PipeTransform {
  transform(value: string | null): string {       
      if (value) {
          value = value.replace('&#039;', "'");             
          return value;
      }
      return '';
  }

}
