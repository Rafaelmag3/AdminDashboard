import { Component, computed, inject } from '@angular/core';
import { ICONS } from '@constants/icons.contants';
import { DashboardCard } from '@features/dashboard/components/dashboard-card/dashboard-card';
import { RecentCustomers } from '@features/dashboard/components/recent-customers/recent-customers';
import { DashboardCardItem } from '@features/dashboard/models/dashboard-card-item.interface';
import { DashboardService } from '@features/dashboard/services/dashboard-service';
import { RecentProducts } from '@features/dashboard/components/recent-products/recent-products';

@Component({
  selector: 'app-dashboard',
  imports: [DashboardCard, RecentCustomers, RecentProducts],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  private readonly dashboardService = inject(DashboardService);
  public readonly metrics = computed(() => this.dashboardService.metrics());
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
}
