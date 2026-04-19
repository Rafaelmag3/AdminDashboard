import { inject, Injectable } from '@angular/core';
import { Customer } from '@core/models/customer.inteface';
import { GenericResponse } from '@core/models/generic-response.interface';
import { PageChangeEvent } from '@core/models/pagination.inteface';
import { ApiService } from '@core/services/api-service';
import { environment } from '@env/environment';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private readonly apiService = inject(ApiService);

  public getCustomers(pagination?: PageChangeEvent): Observable<GenericResponse<Customer[] | null>> {
    return this.apiService.post<GenericResponse<Customer[] | null>>(environment.API_URL.CUSTOMERS.GET_CUSTOMERS_URL, {
      page: pagination?.page,
      limit: pagination?.limit
    }).pipe(map(response => ({
      ...response,
      data: response.data
    })));
  }

  public getTotalCustomers(): Observable<number> {
    return this.apiService.get<number>(environment.API_URL.CUSTOMERS.CUSTOMERS_COUNT_URL);
  }
}
