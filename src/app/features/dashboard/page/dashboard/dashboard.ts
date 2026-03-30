import { Component, computed, inject } from '@angular/core';
import { UserStoreService } from '@core/services/user-store-service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private readonly userStoreService = inject(UserStoreService);
  public readonly user = computed(() => this.userStoreService.user())

  showData() {
    console.log(this.user());
  }

  deleteData() {
    this.userStoreService.logout();
  }
}
