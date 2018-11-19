import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "sort"
})

export class ArraySortPipe  implements PipeTransform {
  transform(array: any[], field: string): any[] {
    if (array !== undefined) {
      array.sort((a: any, b: any) => {
        var first = a[field].toLowerCase();
        var secound = b[field].toLowerCase();

        if (first < secound) {
          return -1;
        } else if (first > secound) {
          return 1;
        } else {
          return 0;
        }
      });
      return array;
    }
  }
}
