import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'datePipe'
})
export class DatePipePipe implements PipeTransform {

  transform(inputDate: string): string {
    const date = new Date(inputDate);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';

    const formattedDate = `${day}.${month}.${year} | ${hours % 12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    return formattedDate;
  }

}
