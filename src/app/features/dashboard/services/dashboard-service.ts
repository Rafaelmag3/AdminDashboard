import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApiService } from '@core/services/api-service';
import { forkJoin } from 'rxjs';
import { GetMetrics } from '@features/dashboard/models/get-metrics.inteface';
import { CustomerService } from '@features/services/customer-service';
import { ProductService } from '@features/services/product-service';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly apiService = inject(ApiService);
  private readonly customerService = inject(CustomerService);
  private readonly productService = inject(ProductService);
  private readonly _getMetrics = toSignal<GetMetrics>(
    forkJoin({
      totalCustomers: this.customerService.getTotalCustomers(),
      totalServices: this.productService.getTotalProducts(),
    })
  );

  public readonly metrics = computed(() => this._getMetrics());
}
