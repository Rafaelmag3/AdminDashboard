import { Component, computed, effect, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PATH_CONSTANTS } from '@constants/path.constants';
import { CustomerTable } from '@core/models/customer.inteface';
import { PageChangeEvent, PaginatedResponse } from '@core/models/pagination.inteface';
import { NavigationService } from '@core/services/navigation-service';
import { CustomerService } from '@features/services/customer-service';
import { Pagination } from '@shared/pagination/pagination';

@Component({
  selector: 'customers',
  imports: [Pagination],
  templateUrl: './customers.html',
})
export class Customers implements OnInit {
  private readonly customerService = inject(CustomerService);
  private readonly navigationService = inject(NavigationService);
  private readonly _totalCustomers = toSignal(this.customerService.getTotalCustomers());
  public readonly tableCheckbox = viewChild<ElementRef<HTMLInputElement>>('tableCheckbox');
  private readonly _customers = signal<CustomerTable[] | null>(null);
  public readonly totalCustomers = computed(() => this._totalCustomers());
  public readonly customers = computed(() => this._customers());
  public readonly isDisabledDelete = computed(() => {
    const customer = this.customers();
    if (!customer) return true;
    const customersSelected = customer.some(c => c.checkbox);
    return !customersSelected;
  });

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

  constructor() {
    effect(() => {
      this.updateMasterCheckbox();
    });
  }

  ngOnInit(): void {
    this.getCustomers();
  }

  getCustomers(page: number = 1, limit: number = 10): void {
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

  checkAllCustomers(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this._customers.update(customers =>
      customers?.map(c => ({ ...c, checkbox: checked })) || null
    );
  }

  selectCustomers(customer: CustomerTable): void {
    this._customers.update(customers =>
      customers?.map(c =>
        c.idCustomer === customer.idCustomer
          ? { ...c, checkbox: !c.checkbox }
          : c
      ) || null
    );
  }

  private updateMasterCheckbox(): void {
    const all = this.customers();
    const totalSelected = all?.filter(c => c.checkbox).length;
    const checkbox = this.tableCheckbox()?.nativeElement;
    if (!checkbox) return;
    if (totalSelected === 0) {
      checkbox.checked = false;
      return;
    }
    if (totalSelected === all?.length) {
      checkbox.checked = true;
      return;
    }
    checkbox.checked = false;
  }

  onPageChange(event: PageChangeEvent): void {
    this.pagination.set({
      ...this.pagination(),
      page: event.page,
      limit: event.limit
    });
    this.getCustomers(this.pagination().page, this.pagination().limit);
  }

  btnNewCustomer() {
    this.navigationService.navigateTo(PATH_CONSTANTS.CUSTOMER_FORM);
  }
}
