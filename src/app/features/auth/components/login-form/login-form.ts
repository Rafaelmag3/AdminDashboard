import { Component, computed, inject, signal } from '@angular/core';
import { email, form, FormField, maxLength, minLength, required } from '@angular/forms/signals';
import { LoginFormModel } from '@features/auth/models/login-form-interface';
import { ApiService } from '@core/services/api-service';
import { Alert } from '@shared/alert/alert';
import { SessionStorageService } from '@core/services/session-storage-service';
import { NavigationService } from '@core/services/navigation-service';
import { LoginResponse } from '@core/models/user-interface';
import { environment } from '@env/environment';

@Component({
  selector: 'login-form',
  imports: [FormField, Alert],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
})
export class LoginForm {
  private readonly apiService = inject(ApiService);
  private readonly sessionStorageService = inject(SessionStorageService);
  private readonly navigationService = inject(NavigationService);
  public readonly showAlert = signal(false);
  public readonly showPassword = signal(false);
  public readonly typeAlert = 'danger';
  public readonly passwordInputType = computed(() => this.showPassword() ? 'text' : 'password');
  public readonly passwordToggleIcon = computed(() => this.showPassword() ? 'icon-[mdi--eye]' : 'icon-[formkit--eyeclosed]');
  public readonly messageAlert = signal<string>('');
  private readonly loginFormModel = signal<LoginFormModel>({
    email: '',
    password: '',
  });

  public readonly loginForm = form(this.loginFormModel, (inputModel) => {
    required(inputModel.email, { message: 'Email is required' });
    email(inputModel.email, { message: 'Email is not valid' });
    minLength(inputModel.password, 6, { message: 'Password must be at least 6 characters long' });
    maxLength(inputModel.password, 15, { message: 'Password must be at most 15 characters long' });
    required(inputModel.password, { message: 'Password is required' });
  });

  async sendLoginRequest(event: Event) {
    event.preventDefault();
    if (this.loginForm().valid()) {
      this.apiService.post<LoginResponse | null>(environment.API_URL.LOGIN_URL, this.loginForm().value()).subscribe({
        next: async (loginData) => {
          if (!loginData) {
            this.alertOpen();
            return;
          }
          const key = await this.sessionStorageService.get<string | null>(environment.SESSION_KEY);
          if (!key) {
            this.alertOpen();
            return;
          }
          const user = loginData.user;
          this.sessionStorageService.set(key, user);
          this.sessionStorageService.set(`${key}${environment.TOKEN_KEY}`, loginData.token);
          this.navigationService.navigateTo('dashboard');
        },
        error: (error) => {
          if (error) {
            this.messageAlert.set(error);
            this.showAlert.set(true);
          }
        }
      });
    }
  };

  alertClosed() {
    this.messageAlert.set('');
    this.showAlert.set(false);
  }

  private alertOpen() {
    this.messageAlert.set('Its not possible to login');
    this.showAlert.set(true);
  }

  public togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword());
  }
}
