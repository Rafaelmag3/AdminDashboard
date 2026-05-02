import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PATH_CONSTANTS } from '@constants/path.constants';
import { CustomerTable } from '@core/models/customer.inteface';
import { NavigationService } from '@core/services/navigation-service';
import { CustomerService } from '@features/services/customer-service';
import { Table } from '@features/customers/components/table/table';

@Component({
  selector: 'customers',
  imports: [Table],
  templateUrl: './customers.html',
})
export class Customers {
  private readonly customerService = inject(CustomerService);
  private readonly navigationService = inject(NavigationService);
  private readonly _totalCustomers = toSignal(this.customerService.getTotalCustomers());
  private readonly _selectedCustomers = signal<CustomerTable[] | null>(null);
  public readonly totalCustomers = computed(() => this._totalCustomers());
  public readonly selectedCustomers = computed(() => this._selectedCustomers());
  public readonly isDisabledDelete = computed(() => {
    const customer = this.selectedCustomers();
    if (!customer) return true;
    const customersSelected = customer.some(c => c.checkbox);
    return !customersSelected;
  });

  btnNewCustomer() {
    this.navigationService.navigateTo(PATH_CONSTANTS.CUSTOMER_FORM);
  }

  onSelectedCustomers(customers: CustomerTable[] | null): void {
    this._selectedCustomers.set(customers);
  }
}
