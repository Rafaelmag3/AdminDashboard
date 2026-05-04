import { inject, Injectable, signal } from '@angular/core';
import { GenericResponse } from '@core/models/generic-response.interface';
import { PageChangeEvent } from '@core/models/pagination.inteface';
import { Product } from '@core/models/product.inteface';
import { ApiService } from '@core/services/api-service';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly apiService = inject(ApiService);
  public dataUpdateProduct = signal<Product | null>(null);

  public getProducts(pagination?: PageChangeEvent) {
    return this.apiService.post<GenericResponse<Product[] | null>>(environment.API_URL.SERVICES.GET_PRODUCTS_URL, {
      page: pagination?.page,
      limit: pagination?.limit
    });
  }

  public getTotalProducts() {
    return this.apiService.get<number>(environment.API_URL.SERVICES.SERVICES_COUNT_URL);
  }
}
