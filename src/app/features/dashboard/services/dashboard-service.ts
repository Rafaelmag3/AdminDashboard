import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApiService } from '@core/services/api-service';
import { environment } from '@env/environment';
import { forkJoin } from 'rxjs';
import { GetMetrics } from '@features/dashboard/models/get-metrics.inteface';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly apiService = inject(ApiService);
  private readonly _getMetrics = toSignal<GetMetrics>(
    forkJoin({
      totalCustomers: this.getTotalCustomers(),
      totalServices: this.getTotalServices(),
    })
  );

  public readonly metrics = computed(() => this._getMetrics());

  private getTotalCustomers() {
    return this.apiService.get<number>(environment.CUSTOMERS_COUNT_URL);
  }

  private getTotalServices() {
    return this.apiService.get<number>(environment.SERVICES_COUNT_URL);
  }
}
