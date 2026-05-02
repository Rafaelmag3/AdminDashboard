import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { PATH_CONSTANTS } from '@constants/path.constants';
import { Customer } from '@core/models/customer.inteface';
import { NavigationService } from '@core/services/navigation-service';
import { CustomerService } from '@features/services/customer-service';
import { Card } from '@shared/card/card';

@Component({
  selector: 'recent-customers',
  imports: [Card],
  templateUrl: './recent-customers.html',
})
export class RecentCustomers implements OnInit {
  private readonly customerService = inject(CustomerService);
  private readonly navigationService = inject(NavigationService);
  private readonly _customers = signal<Customer[] | null>(null);
  public readonly customers = computed(() => this._customers());
  public readonly serviceErrorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.getRecentCustomers();
  }

  private getRecentCustomers(): void {
    this.customerService.getCustomers().subscribe({
      next: (response) => {
        if (!response.data) {
          this.serviceErrorMessage.set('No Recent Customers');
          this._customers.set(null);
          return;
        }
        this._customers.set(response.data);
        this.serviceErrorMessage.set(null);
      },
      error: (error) => {
        this.serviceErrorMessage.set(error.message);
        this._customers.set(null);
      }
    });
  }

  btnReloadCustomers(): void {
    this.getRecentCustomers();
  }

  btnSeeAllCustomers(): void {
    this.navigationService.navigateTo(PATH_CONSTANTS.CUSTOMERS)
  }
}
