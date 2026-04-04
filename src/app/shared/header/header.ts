import { Component, input } from '@angular/core';
import { Card } from '@shared/card/card';

@Component({
  selector: 'shared-header',
  imports: [Card],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  public readonly currentNamePage = input.required<string>();
}
