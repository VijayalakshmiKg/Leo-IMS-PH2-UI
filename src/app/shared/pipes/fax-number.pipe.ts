import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'faxNumber'
})
export class FaxNumberPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return value;

    // Remove non-digit characters
    let cleaned = value.replace(/\D/g, '');

    // Check if it starts with '0' or '44' (UK country code)
    if (cleaned.startsWith('44')) {
      cleaned = cleaned.substring(2);
    } else if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1);
    }

    // Add +44 and format
    return ` ${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }

}
