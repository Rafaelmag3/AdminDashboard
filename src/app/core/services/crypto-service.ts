import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
/**
 * CryptoService — AES-GCM + PBKDF2
 *
 * Encripta y desencripta strings usando la Web Crypto API nativa.
 * La clave se deriva de una passphrase con PBKDF2 (100k iteraciones, SHA-256).
 *
 * Uso:
 *   const encrypted = await this.crypto.encrypt('datos sensibles');
 *   const original  = await this.crypto.decrypt(encrypted);
 */
export class CryptoService {

  async encrypt(plaintext: string): Promise<string> {
    try {
      const salt = crypto.getRandomValues(new Uint8Array(environment.SALT_LENGTH));
      const iv = crypto.getRandomValues(new Uint8Array(environment.IV_LENGTH));
      const key = await this.deriveKey(salt);
      const encoded = new TextEncoder().encode(plaintext);

      const ciphertext = await crypto.subtle.encrypt(
        { name: environment.ALGORITHM, iv },
        key,
        encoded
      );
      const result = this.concat(salt, iv, new Uint8Array(ciphertext));
      return this.toBase64(result);
    } catch (error) {
      throw new Error('Error encrypting data');
    }
  }

  /**
   * Desencripta un string producido por `encrypt()`.
   */
  async decrypt(encryptedBase64: string): Promise<string> {
    try {
      const data = this.fromBase64(encryptedBase64);
      const salt = data.slice(0, environment.SALT_LENGTH);
      const iv = data.slice(environment.SALT_LENGTH, environment.SALT_LENGTH + environment.IV_LENGTH);
      const ciphertext = data.slice(environment.SALT_LENGTH + environment.IV_LENGTH);
      const key = await this.deriveKey(salt);

      const decrypted = await crypto.subtle.decrypt(
        { name: environment.ALGORITHM, iv },
        key,
        ciphertext
      );
      return new TextDecoder().decode(decrypted);
    } catch (error) {
      throw new Error('Error decrypting data');
    }
  }

  /**
   * Encripta un objeto y devuelve un string base64.
   * Útil para localStorage o payloads HTTP.
   */
  async encryptObject<T>(obj: T): Promise<string> {
    return this.encrypt(JSON.stringify(obj));
  }

  /**
   * Desencripta y parsea un objeto JSON.
   */
  async decryptObject<T>(encryptedBase64: string): Promise<T> {
    const json = await this.decrypt(encryptedBase64);
    return JSON.parse(json) as T;
  }

  /** Deriva una CryptoKey AES-GCM a partir de la passphrase y un salt. */
  private async deriveKey(salt: Uint8Array): Promise<CryptoKey> {
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(environment.PASSPHRASE),
      'PBKDF2',
      false,
      ['deriveKey']
    );
    const saltArrayBuffer = new Uint8Array(salt);
    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: saltArrayBuffer,
        iterations: environment.ITERATIONS,
        hash: environment.HASH,
      },
      keyMaterial,
      { name: environment.ALGORITHM, length: environment.KEY_LENGTH },
      false,
      ['encrypt', 'decrypt']
    );
  }

  public generateRandom(): string {
    return crypto.randomUUID();
  }

  private concat(...arrays: Uint8Array[]): Uint8Array {
    const total = arrays.reduce((sum, a) => sum + a.length, 0);
    const result = new Uint8Array(total);
    let offset = 0;
    for (const arr of arrays) {
      result.set(arr, offset);
      offset += arr.length;
    }
    return result;
  }

  private toBase64(bytes: Uint8Array): string {
    return btoa(String.fromCharCode(...bytes));
  }

  private fromBase64(base64: string): Uint8Array {
    return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
  }

}