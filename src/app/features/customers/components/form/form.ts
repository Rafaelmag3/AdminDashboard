import { Component, inject, signal } from '@angular/core';
import { email, form, required, FormField, minLength, maxLength } from '@angular/forms/signals';
import { FormValidationConstants } from '@constants/formValidation.constants';
import { PATH_CONSTANTS } from '@constants/path.constants';
import { AllowedChars } from '@core/directives/allowed-chars';
import { NewCustomer } from '@core/models/customer.inteface';
import { NavigationService } from '@core/services/navigation-service';
import { phoneNumber } from '@core/validators/phone-number.validator';
import { CustomerService } from '@features/services/customer-service';
import { Alert } from '@shared/alert/alert';
import { TypeAlert } from '@shared/models/alert.interface';

@Component({
  selector: 'customer-form',
  imports: [FormField, Alert, AllowedChars],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class Form {
  private readonly customerService = inject(CustomerService);
  private readonly navigationService = inject(NavigationService);
  public readonly messageAlert = signal<string>('');
  public readonly typeAlert = signal<TypeAlert>('danger');
  public readonly showAlert = signal<boolean>(false);
  public readonly formValidationConstants = FormValidationConstants;
  private readonly customerFormModel = signal<NewCustomer>({
    name: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  });

  public readonly customerForm = form(this.customerFormModel, (input) => {
    required(input.name, { message: 'Name is required' });
    minLength(input.name, 2, { message: 'Name must be at least 2 characters long' });
    maxLength(input.name, 45, { message: 'Name must be at most 45 characters long' });
    minLength(input.lastName, 2, { message: 'Last name must be at least 2 characters long' });
    maxLength(input.lastName, 45, { message: 'Last name must be at most 45 characters long' });
    email(input.email, { message: 'Email invalid' });
    minLength(input.phoneNumber, 10, { message: 'Phone number must be at least 10 characters long' });
    maxLength(input.phoneNumber, 15, { message: 'Phone number must be at most 15 characters long' });
    phoneNumber(input.phoneNumber);
  });

  btnCancelForm(): void {
    this.navigationService.navigateTo(PATH_CONSTANTS.CUSTOMERS);
  }

  onSubmitNewCustomer(event: Event) {
    event.preventDefault();
    if (this.customerForm().invalid()) {
      return;
    }

    this.customerService.createCustomer(this.customerForm().value()).subscribe({
      next: (response) => {
        if (response === null) {
          this.messageAlert.set('Customer created successfully');
          this.typeAlert.set('success');
          this.showAlert.set(true);
          this.resetForm();
          return;
        }
        this.messageAlert.set('Customer creation failed');
        this.typeAlert.set('danger');
        this.showAlert.set(true);
      },
      error: (error: string) => {
        this.messageAlert.set(error);
        this.typeAlert.set('danger');
        this.showAlert.set(true);
      },
    });
  }

  closeAlert(): void {
    this.messageAlert.set('');
    this.typeAlert.set('danger');
    this.showAlert.set(false);
  }

  private readonly resetForm = (): void => {
    this.customerFormModel.set({
      name: '',
      lastName: '',
      email: '',
      phoneNumber: '',
    });
    this.customerForm().reset();
    setTimeout(() => {
      this.closeAlert();
    }, 3500);
  }
}
