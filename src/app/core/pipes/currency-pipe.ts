import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currency',
})
export class CurrencyPipe implements PipeTransform {

  transform(value: string | number | null | undefined): string {
    if (!value) return '$0.00';
    return `$${value}`;
  }

}
