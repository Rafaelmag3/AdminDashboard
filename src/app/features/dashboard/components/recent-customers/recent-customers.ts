import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Customer } from '@core/models/customer.inteface';
import { CustomerService } from '@features/services/customer-service';
import { Card } from '@shared/card/card';

@Component({
  selector: 'recent-customers',
  imports: [Card],
  templateUrl: './recent-customers.html',
})
export class RecentCustomers implements OnInit {
  private readonly customerService = inject(CustomerService);
  private readonly _customers = signal<Customer[] | null>(null);
  public readonly customers = computed(() => this._customers());

  ngOnInit(): void {
    this.getRecentCustomers();
  }

  private getRecentCustomers(): void {
    this.customerService.getCustomers().subscribe(response => {
      if (!response.data) {
        this._customers.set(null);
        return;
      }
      this._customers.set(response.data);
    });
  }

  btnReloadCustomers(): void {
    this.getRecentCustomers();
  }
}
