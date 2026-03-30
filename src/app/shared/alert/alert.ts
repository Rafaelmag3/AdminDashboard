import { Component, computed, input, output, signal } from '@angular/core';
import { TypeAlert } from '@shared/models/alert.interface';
@Component({
  selector: 'shared-alert',
  imports: [],
  templateUrl: './alert.html',
  styleUrl: './alert.css',
})
export class Alert {
  textAlert = input<string>('');
  showAlert = input<boolean>(false);
  typeAlert = input<TypeAlert>('success');
  isShowAlert = signal(this.showAlert());
  alertClosed = output();
  backgroundColorAlert = computed(() => `alert--${this.typeAlert()}`)

  closeAlert() {
    this.alertClosed.emit();
  }
}
