import { Component, inject } from '@angular/core';
import { PATH_CONSTANTS } from '@constants/path.constants';
import { NavigationService } from '@core/services/navigation-service';

@Component({
  selector: 'app-customer-form',
  imports: [],
  templateUrl: './customer-form.html',
  styleUrl: './customer-form.css',
})
export class CustomerForm {
  private readonly navigationService = inject(NavigationService);

  btnCancelForm(): void {
    this.navigationService.navigateTo(PATH_CONSTANTS.CUSTOMERS);
  }
}
