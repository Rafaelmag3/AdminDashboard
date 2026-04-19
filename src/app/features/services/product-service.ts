import { inject, Injectable } from '@angular/core';
import { GenericResponse } from '@core/models/generic-response.interface';
import { Pagination } from '@core/models/pagination.inteface';
import { Product } from '@core/models/product.inteface';
import { ApiService } from '@core/services/api-service';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly apiService = inject(ApiService);

  public getProducts(pagination?: Pagination) {
    return this.apiService.post<GenericResponse<Product[] | null>>(environment.API_URL.PRODUCTS.GET_PRODUCTS_URL, {
      page: pagination?.page,
      limit: pagination?.limit
    });
  }
}
