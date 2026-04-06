import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ICONS } from '@constants/icons.contants';
import { Customer } from '@core/models/customer.inteface';
import { DashboardCard } from '@features/dashboard/components/dashboard-card/dashboard-card';
import { DashboardCardItem } from '@features/dashboard/models/dashboard-card-item.interface';
import { DashboardService } from '@features/dashboard/services/dashboard-service';
import { CustomerService } from '@features/services/customer-service';
import { Card } from '@shared/card/card';

@Component({
  selector: 'app-dashboard',
  imports: [DashboardCard, Card],
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly customerService = inject(CustomerService);
  private readonly _customers = signal<Customer[] | null>(null);
  public readonly metrics = computed(() => this.dashboardService.metrics());
  public readonly customers = computed(() => this._customers());
  public readonly cardsDashboard = computed<DashboardCardItem[]>(() => [
    {
      title: 'Total Services',
      total: this.metrics()?.totalServices ?? 0,
      icon: ICONS.SERVICES,
      stylesIconCard: 'bg-blue-100 text-blue-500 rounded-full p-2 flex items-center justify-center',
    },
    {
      title: 'Total Customers',
      total: this.metrics()?.totalCustomers ?? 0,
      icon: ICONS.CUSTOMERS,
      stylesIconCard: 'bg-green-100 text-green-500 rounded-full p-2 flex items-center justify-center',
    },
  ]);

  ngOnInit(): void {
    this.getRecentCustomers();
  }

  /*
  * Method used to get the recent customers
  */
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
