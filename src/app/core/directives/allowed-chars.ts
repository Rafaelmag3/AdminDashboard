import { Directive, input } from '@angular/core';
import { RegexConstants } from '@constants/regex.contants';

@Directive({
  selector: '[allowedChars]',
  host: {
    '(keydown)': 'onKeyDown($event)',
    '(paste)': 'onPaste($event)',
    '(input)': 'onInput($event)'
  }
})
export class AllowedChars {

  public readonly allowedChars = input.required<string>();
  private readonly emojiRegex = RegexConstants.EMOJI_REGEX;

  constructor() { }

  private isEmoji(char: string): boolean {
    return this.emojiRegex.test(char);
  }

  private isAllowed(char: string): boolean {
    if (this.isEmoji(char)) return false;
    return this.allowedChars().includes(char);
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cleaned = input.value
      .split('')
      .filter(char => this.isAllowed(char))
      .join('');

    if (cleaned !== input.value) {
      input.value = cleaned;
      input.dispatchEvent(new Event('input'));
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    const controlKeys = [
      'Backspace', 'Delete', 'Tab', 'Enter',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'Home', 'End', 'Escape'
    ];

    if (controlKeys.includes(event.key)) return;
    if (event.ctrlKey || event.metaKey) return;
    if (!this.isAllowed(event.key)) {
      event.preventDefault();
    }
  }

  onPaste(event: ClipboardEvent): void {
    const pastedText = event.clipboardData?.getData('text') ?? '';

    const isValid = pastedText.split('').every(char =>
      this.allowedChars().includes(char)
    );

    if (!isValid) {
      event.preventDefault();
    }
  }
}
