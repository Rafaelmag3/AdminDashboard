import { Component, inject, OnInit } from '@angular/core';
import { LoginForm } from '@features/auth/components/login-form/login-form';
import { SessionStorageService } from '@core/services/session-storage-service';
import { CryptoService } from '@core/services/crypto-service';
import { environment } from '@env/environment';

@Component({
  selector: 'login',
  imports: [LoginForm],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  private readonly sessionStorageService = inject(SessionStorageService);
  private readonly cryptoService = inject(CryptoService);
  public readonly logoImage = environment.LOGO_URL;
  public readonly iconApp = environment.ICON_APP_URL;

  ngOnInit(): void {
    this.sessionStorageService.set(environment.SESSION_KEY, this.cryptoService.generateRandom())
  }


}
