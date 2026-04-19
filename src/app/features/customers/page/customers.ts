import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CustomerTable } from '@core/models/customer.inteface';
import { PageChangeEvent, PaginatedResponse } from '@core/models/pagination.inteface';
import { CustomerService } from '@features/services/customer-service';
import { Pagination } from '@shared/pagination/pagination';

@Component({
  selector: 'customers',
  imports: [Pagination],
  templateUrl: './customers.html',
})
export class Customers implements OnInit {
  private readonly customerService = inject(CustomerService);
  private readonly _totalCustomers = toSignal(this.customerService.getTotalCustomers());
  private readonly _customers = signal<CustomerTable[] | null>(null);
  public readonly totalCustomers = computed(() => this._totalCustomers());
  public readonly customers = computed(() => this._customers());
  public readonly pagination = signal<PaginatedResponse>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasNext: false,
    hasPrev: false
  });

  public readonly headerCustomers = [
    {
      name: 'Checkbox',
      key: 'checkbox',
      showName: false
    },
    {
      name: 'Name',
      key: 'name',
      showName: true
    },
    {
      name: 'Email',
      key: 'email',
      showName: true
    },
    {
      name: 'Phone',
      key: 'phone',
      showName: true
    },
    {
      name: 'Actions',
      key: 'actions',
      showName: true
    }
  ];

  ngOnInit(): void {
    this.getCustomers();
  }

  getCustomers(page: number = 1, limit: number = 10) {
    this.customerService.getCustomers({ page, limit }).subscribe({
      next: (response) => {
        if (!response || !response.data) {
          this._customers.set(null);
          return;
        }
        this._customers.set(response.data.map((customer) => ({
          ...customer,
          checkbox: false
        })));
        this.pagination.set({
          total: response.total,
          page: response.page,
          limit: response.limit,
          totalPages: response.totalPages,
          hasNext: response.hasNext,
          hasPrev: response.hasPrev
        })
      },
      error: () => {
        this._customers.set(null);
      }
    })
  }

  checkAllCustomers() {
    this._customers.update((customers) => {
      return customers?.map((c) => {
        return {
          ...c,
          checkbox: !c.checkbox
        };
      }) || null;
    });
  }

  onPageChange(event: PageChangeEvent) {
    this.pagination.set({
      ...this.pagination(),
      page: event.page,
      limit: event.limit
    });
    this.getCustomers(this.pagination().page, this.pagination().limit);
  }
}
