import { inject, Injectable } from '@angular/core';
import { CryptoService } from '@core/services/crypto-service';

@Injectable({
  providedIn: 'root',
})
export class SessionStorageService<T> {
  private readonly cryptoService = inject(CryptoService);

  async set(key: string, data: T): Promise<void> {
    try {
      const dataString = JSON.stringify(data);
      const dataEncrypt = await this.cryptoService.encrypt(dataString);
      sessionStorage.setItem(key, dataEncrypt);
    } catch (error) {
      throw new Error('Error to save data on session storage')
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const keySession = sessionStorage.getItem(key);
      if (!keySession) {
        return null;
      }
      const dataDecrypt = await this.cryptoService.decrypt(keySession);
      return JSON.parse(dataDecrypt) as T;
    } catch (error) {
      throw new Error('Error to get data on session storage')
    }
  }

  async delete(key: string): Promise<void> {
    try {
      const keySession = sessionStorage.getItem(key);
      if (!keySession) {
        return;
      }
      const keyDecrypt = await this.cryptoService.decrypt(keySession);
      sessionStorage.removeItem(keyDecrypt);
    } catch (error) {
      throw new Error('Error to delete data on session storage')
    }
  }

  clean() {
    try {
      sessionStorage.clear();
    } catch (error) {
      throw new Error('Error to clean session storage')
    }
  }
}
