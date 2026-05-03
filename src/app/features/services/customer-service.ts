import { inject, Injectable, signal } from '@angular/core';
import { Customer, NewCustomer, UpdateCustomer } from '@core/models/customer.inteface';
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
  public readonly dataUpdateCustomer = signal<UpdateCustomer | null>(null);

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

  public createCustomer(customer: NewCustomer): Observable<string | null> {
    return this.apiService.post<string | null, NewCustomer>(environment.API_URL.CUSTOMERS.CREATE_CUSTOMER_URL, customer);
  }

  public updateCustomer(customer: UpdateCustomer): Observable<string | null> {
    return this.apiService.put<string | null, UpdateCustomer>(environment.API_URL.CUSTOMERS.UPDATE_CUSTOMER_URL, customer);
  }
}
