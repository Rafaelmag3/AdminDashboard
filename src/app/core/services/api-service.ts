import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly http = inject(HttpClient);

  public get<T>(endpoint: string, params?: Record<string, string>): Observable<T> {
    const httpParams = params ? new HttpParams({ fromObject: params }) : undefined;
    return this.http
      .get<T>(endpoint, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

  public post<T, B = unknown>(endpoint: string, body: B): Observable<T> {
    return this.http
      .post<T>(endpoint, body)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    const message = error?.error?.message ?? 'Service not available';
    return throwError(() => new Error(message));
  }
}
