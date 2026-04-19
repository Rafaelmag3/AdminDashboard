import { Component, computed, input, output } from '@angular/core';
import { PageChangeEvent } from '@core/models/pagination.inteface';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'pagination',
  imports: [MatMenuModule, MatButtonModule],
  templateUrl: './pagination.html',
})
export class Pagination {
  public readonly currentPage = input.required<number>();
  public readonly totalPages = input.required<number>();
  public readonly total = input.required<number>();
  public readonly limit = input.required<number>();
  public readonly hasNext = input.required<boolean>();
  public readonly hasPrev = input.required<boolean>();
  public readonly pageChange = output<PageChangeEvent>();
  public limitOptions = [5, 10, 25, 50];
  public rangeStart = computed(() =>
    (this.currentPage() - 1) * this.limit() + 1
  );
  public rangeEnd = computed(() =>
    Math.min(this.currentPage() * this.limit(), this.total())
  );
  public visiblePages = computed(() => {
    const cur = this.currentPage();
    const total = this.totalPages();
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const pages: number[] = [1];
    if (cur > 3) pages.push(-1);
    for (let i = Math.max(2, cur - 1); i <= Math.min(total - 1, cur + 1); i++)
      pages.push(i);
    if (cur < total - 2) pages.push(-1);
    pages.push(total);
    console.log(pages);

    return pages;
  });

  public changePage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.pageChange.emit({ page, limit: this.limit() });
  }

  public changeLimit(limit: number) {
    this.pageChange.emit({ page: 1, limit });
  }
}
