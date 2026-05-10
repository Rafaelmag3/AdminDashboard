import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { email, form, required, FormField, minLength, maxLength } from '@angular/forms/signals';
import { FormValidationConstants } from '@constants/form-validation.constants';
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
export class Form implements OnInit {
  private readonly customerService = inject(CustomerService);
  private readonly navigationService = inject(NavigationService);
  public readonly messageAlert = signal<string>('');
  public readonly typeAlert = signal<TypeAlert>('danger');
  public readonly showAlert = signal<boolean>(false);
  public readonly disabledButton = signal<boolean>(false);
  public readonly formValidationConstants = FormValidationConstants;
  private readonly customerFormModel = signal<NewCustomer>({
    name: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  });
  public readonly dataUpdateCustomer = computed(() => this.customerService.dataUpdateCustomer());
  public readonly formMode = signal<string>('New Customer');
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

  ngOnInit(): void {
    const dataCustomer = this.dataUpdateCustomer();
    if (!dataCustomer) return;
    this.formMode.set('Edit Customer');
    this.customerFormModel.set({
      email: dataCustomer.email ?? '',
      lastName: dataCustomer.lastName,
      name: dataCustomer.name,
      phoneNumber: dataCustomer.phoneNumber ?? '',
    });
  }

  btnCancelForm(): void {
    this.navigationService.navigateTo(PATH_CONSTANTS.CUSTOMERS);
  }

  /**
   * This method is called when the customer form is submitted
   * It validates the form
   * It calls the create customer or update customer method
   */
  onSubmitCustomer(event: Event): void {
    event.preventDefault();
    if (this.customerForm().invalid()) {
      return;
    }
    if (!this.dataUpdateCustomer()) {
      this.createCustomer();
      return;
    }

    this.updateCustomer();
  }

  /**
   * This method is called when the customer creation is performed
   * It sets the success message and type alert
   * It resets the form and redirects to the customers list
   */
  private createCustomer(): void {
    this.customerService.createCustomer(this.customerForm().value()).subscribe({
      next: (response) => {
        if (response === null) {
          this.operationSuccess('Customer created successfully');
          this.disabledButton.set(true);
          return;
        }
        this.errorOperation('Customer creation failed');
      },
      error: (error: string) => {
        this.errorOperation(error);
      },
    });
  }

  /**
   * This method is called when the update operation is performed
   * It sets the update message and type alert
   * It resets the form and redirects to the customers list
   */
  private updateCustomer(): void {
    const idCustomer = this.dataUpdateCustomer()?.idCustomer;
    if (!idCustomer) return;
    this.customerService.updateCustomer({
      idCustomer,
      ...this.customerForm().value(),
    }).subscribe({
      next: (response) => {
        if (response === null) {
          this.operationSuccess('Customer updated successfully');
          this.disabledButton.set(true);
          return;
        }
        this.errorOperation('Customer updated failed');
      },
      error: (error: string) => {
        this.errorOperation(error);
      },
    })
  }

  /**
   * This method is called when the alert is closed
   * It sets the alert message and type alert to its default values
   * It hides the alert
   */
  closeAlert(): void {
    this.messageAlert.set('');
    this.typeAlert.set('danger');
    this.showAlert.set(false);
  }

  /**
   * This method is called when the customer form is reset
   * It sets the customer form model to a new customer
   * It resets the customer form
   */
  private readonly resetForm = (): void => {
    this.customerFormModel.set({
      name: '',
      lastName: '',
      email: '',
      phoneNumber: '',
    });
    this.customerForm().reset();
  }


  /**
   * This method is called when an error occurs during customer creation or update
   * It sets the error message and type alert
   * It shows the alert
   */
  private errorOperation(message: string): void {
    this.messageAlert.set(message);
    this.typeAlert.set('danger');
    this.showAlert.set(true);
  }

  /**
   * This method is called when the update operation is successful
   * It sets the success message and type alert
   * It resets the form and redirects to the customers list
   */
  private operationSuccess(message: string): void {
    this.messageAlert.set(message);
    this.typeAlert.set('success');
    this.showAlert.set(true);
    setTimeout(() => {
      this.resetForm();
      this.closeAlert();
      this.navigationService.navigateTo(PATH_CONSTANTS.CUSTOMERS);
    }, 1500);
  }
}
