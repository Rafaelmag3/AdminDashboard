import { Component, computed, inject } from '@angular/core';
import { LoadingService } from '@core/services/loading-service';

@Component({
  selector: 'shared-loader',
  imports: [],
  templateUrl: './loader.html',
  styleUrl: './loader.css',
})
export class Loader {
  private readonly loadingService = inject(LoadingService);

  readonly isLoading = computed(() => this.loadingService.isLoading());
}
