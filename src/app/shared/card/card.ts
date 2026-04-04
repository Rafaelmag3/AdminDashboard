import { Component, input } from '@angular/core';

@Component({
  selector: 'shared-card',
  imports: [],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class Card {
  stylesCard = input<string>();
}
