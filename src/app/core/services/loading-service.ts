import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private readonly _isLoading = signal<boolean>(false);
  readonly isLoading = computed(() => this._isLoading());

  show() { this._isLoading.set(true); }
  hide() { this._isLoading.set(false); }
}
