import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://192.168.100.15:3201';

  get<T>(endpoint: string, params?: Record<string, string>) {
    const httpParams = params ? new HttpParams({ fromObject: params }) : undefined;
    return this.http
      .get<T>(`${this.baseUrl}/${endpoint}`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

  post<T, B = unknown>(endpoint: string, body: B): Observable<T> {
    return this.http
      .post<T>(`${endpoint}`, body)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    const message = error?.error?.message ?? 'Service not available';
    return throwError(() => new Error(message));
  }
}
